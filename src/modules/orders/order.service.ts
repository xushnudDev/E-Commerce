import { Injectable, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/db";
import { OrderTableModel } from "./models";
import { ICreateOrder } from "./interface/order-interface";
import { NotFoundException } from "@nestjs/common";
@Injectable()
export class OrderService implements OnModuleInit {
    constructor(private readonly pg:PostgresService) {};

    async onModuleInit() {
        try {
            await this.pg.query(OrderTableModel);
            console.log("Order table created successfully");
        } catch (error) {
            console.log("Error creating Order table!");
            
        }
    };

    async getAllOrders() {
        const orders = await this.pg.query(`
            SELECT 
    users.id AS user_id,
    users.fullname AS user_name,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'product_id', products.id,
        'product_name', products.name,
        'product_images', products.images,
        'order_info', JSON_BUILD_OBJECT(
            'order_id', o.id,
            'count', o.count
        )
      )
    ) AS products
FROM users
JOIN orders o ON users.id = o.user_id
JOIN products ON o.product_id = products.id
GROUP BY users.id, users.fullname;

        `);
    
        return {
            message: "success",
            count: orders.length,
            data: orders
        };
    }
    

    async createOrder(payload: ICreateOrder) {
        const product = await this.pg.query("SELECT * FROM products WHERE id = $1",[payload.product_id])
        if(product.length === 0){
            throw new NotFoundException("Maxsulot topilmadi")
        }

        const user = await this.pg.query("SELECT * FROM users WHERE id = $1",[payload.user_id])
        if(user.length === 0){
            throw new NotFoundException("Foydalanuvchi topilmadi")
        }

        const newOrder = await this.pg.query(`INSERT INTO orders(product_id,user_id,count) VALUES ($1,$2,$3) RETURNING *`,
            [payload.product_id, payload.user_id, payload.count])

        return {
            message: "success",
            data: newOrder
        }
    };
    async deleteOrder(id: number) {
        const foundedOrder = await this.pg.query(`SELECT * FROM orders WHERE id = $1`,[id])
        if(foundedOrder.length === 0){
            throw new NotFoundException("Id boyicha buyurtma topilmadi")
        }

        const deleteOrder = await this.pg.query(`DELETE FROM orders WHERE id = $1 RETURNING * `,[id])

        return{
            message:"success",
            data:deleteOrder
        }
    }
}