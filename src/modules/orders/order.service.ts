import { Injectable, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/db";
import { OrderTableModel } from "./models";

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
        try {
            const orders = await this.pg.query("SELECT * FROM orders");
            return orders;
        } catch (error) {
            throw new Error("Error fetching orders");
        }
    };

    async createOrder(user_id:number,items: {product_id:number,quantity:number,price:number}[]) {}
}