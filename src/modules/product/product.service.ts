import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/db";
import { ProductTableModel } from "./models";
import { GetAllProductsDto } from "./dtos/get-all-products.dtos";
import { UpdateProductDto } from "./dtos/update-product.dtos";
import { FsHelper } from "src/helpers";

@Injectable()
export class ProductService implements OnModuleInit {
    constructor(private readonly pg: PostgresService,private readonly fs: FsHelper) {};

    async onModuleInit() {
        try {
            await this.pg.query(ProductTableModel);
            console.log("Product Table created!");
        } catch (error) {
            console.log("Error on conecting to database"); 
        };
    };

    async getAllProducts(queries: GetAllProductsDto) {
        let { limit = 10, page = 1, sortField = 'createdAt', sortDirection = 'asc' } = queries;
        
        const offset = (page - 1) * limit;
    
        const data = await this.pg.query(`
            SELECT 
                p.id,
                p.name,
                p.price,
                p.images,
                c.id AS category_id,
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY ${sortField} ${sortDirection}
            LIMIT $1 OFFSET $2
        `, [limit, offset]);
        
    
        const countResult = await this.pg.query("SELECT COUNT(*) FROM products");
        const count = countResult[0].count;
    
        return {
            message: "Success",
            count: count,
            data: data
        };
    }
    

    async createProduct (payload: {name: string; price: number; category_id: number | string},images: Express.Multer.File) {
       const productImage = await this.fs.uploadFile(images);
        const data = await this.pg.query(
            "insert into products (name,price,category_id,images) values ($1,$2,$3,$4) returning *",
            [payload.name, payload.price, payload.category_id,productImage.fileUrl]
        )
        return {
            message: "Success",
            data: data
        }
    }
    async getProductById (payload: {id: number | string}) {
        const data = await this.pg.query("select * from products where id = $1", [payload.id]);
        return {
            message: "Success",
            data: data
        }
    };
    async updateProduct (id: number | string, payload: UpdateProductDto) {
        const data = await this.pg.query("update products set name = $1, price = $2, category_id = $3 where id = $4 returning *", [payload.name, payload.price, payload.category_id, id]);
        if (data.length == 0) {
            throw new NotFoundException("Not Found");
        }
        return {
            message: "Success",
            data: data
        }
    };
    async deleteProduct (payload: {id: number | string}) {
        const data = await this.pg.query("delete from products where id = $1 returning *", [payload.id]);
        return {
            message: "Success",
            data: data.rows[0]
        }
    }
}