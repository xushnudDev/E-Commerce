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
    

    async createProduct (payload: {name: string; price: number; category_id: number | string},images: Express.Multer.File[]) {
        let imageUrls: string[] = [];

        const category = await this.pg.query("SELECT * FROM categories WHERE id = $1",[payload.category_id])
        if(category.length === 0){
          throw new NotFoundException("Kategoriya topilmadi!")
        }
    
        if (images && images.length > 0) {
            for (const image of images) {
                const uploadedImage = await this.fs.uploadFile(image);
                imageUrls.push(uploadedImage.fileUrl);
            }
        }
    
        const product = await this.pg.query(
            `INSERT INTO products(name, price, category_id, images) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [payload.name, payload.price, payload.category_id, JSON.stringify(imageUrls)]
        );
    
        return {
            message: "success",
            data: product[0],
        };
    }
    async getProductById (payload: {id: number | string}) {
        const data = await this.pg.query("select * from products where id = $1", [payload.id]);
        return {
            message: "Success",
            data: data
        }
    };
    async updateProduct(id: number, payload: UpdateProductDto, images?: Express.Multer.File[]) {
        const found = await this.pg.query('SELECT * FROM products WHERE id = $1', [id]);
        if (!found.length) {
            throw new NotFoundException('Product not found!');
        }
      
        let imageUrls: string[] = [];
        if (found[0].images) {
            if (typeof found[0].images === 'string') {
                imageUrls = JSON.parse(found[0].images); 
            } else {
                imageUrls = found[0].images; 
            }
        }
        if (images && images.length > 0) {
            for (const oldImagePath of imageUrls) {
                await this.fs.deleteFile(oldImagePath);
            }
            imageUrls = [];
            for (const image of images) {
                const uploaded = await this.fs.uploadFile(image);
                imageUrls.push(uploaded.fileUrl);
            }
        }
        const product = await this.pg.query(
            `UPDATE products
                SET 
                    name = COALESCE($1, name),
                    price = COALESCE($2, price),
                    category_id = COALESCE($3, category_id),
                    images = COALESCE($4, images)
                WHERE id = $5 RETURNING *`,
            [payload.name, payload.price, payload.category_id, JSON.stringify(imageUrls), id]
        );
      
        return {
            message: "success",
            data: product[0],
        };
      }
      
      async deleteProduct(id: number) {
        const found = await this.pg.query('SELECT * FROM products WHERE id = $1', [id]);
        if (!found.length) {
            throw new NotFoundException('Product not found!');
        }
        let imageUrls: string[] = [];
        if (found[0].images) {
            if (typeof found[0].images === 'string') {
                imageUrls = JSON.parse(found[0].images); 
            } else {
                imageUrls = found[0].images;
            }
            for (const imagePath of imageUrls) {
                await this.fs.deleteFile(imagePath); 
            }
        }
        const product = await this.pg.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      
        return {
            message: "success",
            data: product[0],
        };
      }
}