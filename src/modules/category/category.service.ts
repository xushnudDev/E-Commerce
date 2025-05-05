import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/db";
import { CategoryTableModel } from "./models";
import { UpdateCategoryDto } from "./dtos/update-category.dtos";
import { GetAllCategoryDto } from "./dtos/get-all-category.dtos";
import { FsHelper } from "src/helpers";

@Injectable()
export class CategoryService implements OnModuleInit {
    constructor(private readonly pg: PostgresService,private fs: FsHelper) {};

    async onModuleInit() {
       try {
        await this.pg.query(CategoryTableModel);
        console.log("Category Table created");
       } catch (error) {
        console.log("Error onModuleInit");
        
       }
    }

    async getAllCategories(queries: GetAllCategoryDto) {
        let {limit = 10,page = 1,sortField = 'createdAt',sortDirection = 'asc'} = queries;
        const offset = (page - 1) * limit;
        const allowedFields = ['name', 'createdAt', 'updatedAt'];
        if (!allowedFields.includes(sortField)) {
            sortField = 'name';
        };

        const result = await this.pg.query(`
            SELECT 
                parent.id, 
                parent.name, 
                COALESCE(
                    json_agg(DISTINCT jsonb_build_object(
                        'id', child.id,
                        'name', child.name
                    )) FILTER (WHERE child.id IS NOT NULL), '[]'
                ) AS subcategories,
                COALESCE((
                    SELECT json_agg(json_build_object(
                        'id', p.id,
                        'name', p.name,
                        'price', p.price,
                        'category_id', p.category_id,
                        'images', p.images
                    ))
                    FROM products p
                    WHERE p.category_id IN (
                        SELECT id FROM categories WHERE category_id = parent.id
                    )
                ), '[]') AS products
            FROM categories parent
            LEFT JOIN categories child ON child.category_id = parent.id
            LEFT JOIN products p ON p.category_id = parent.id
            WHERE parent.category_id IS NULL
            GROUP BY parent.id, parent.name
            ORDER BY parent.${sortField} ${sortDirection};
        `);
        
    
        return {
            message: "success",
            count: result.length,
            data: result,
            queries
        };
    }
    
    
    async getCategoryById(id: number | string) {
        const categoryResult = await this.pg.query(
            "SELECT * FROM categories WHERE id = $1",
            [id]
        );
    
        if (!categoryResult || categoryResult.length === 0) {
            throw new NotFoundException("Category not found");
        }
    
        const productsResult = await this.pg.query(
            "SELECT * FROM products WHERE category_id = $1",
            [id]
        );
    
        return {
            message: "success",
            data: {
                ...categoryResult[0], 
                products: productsResult
            }
        };
    }
    
    

    async createCategory(payload: {name: string; category_id?: number},image:Express.Multer.File) {
        const categoryImage = await this.fs.uploadFile(image);        
        const result = await this.pg.query("INSERT INTO categories (name, category_id,image) VALUES ($1, $2,$3) RETURNING *", [payload.name, payload.category_id,categoryImage.fileUrl]);
        return {
            message: "success",
            data: result
        }
    };

    async deleteCategory(id: number | string) {
        const foundedCategory = await this.pg.query("SELECT * FROM categories WHERE id = $1", [id]);
        if (!foundedCategory) {
            throw new NotFoundException("Category not found");
        };
        const categoryImage = foundedCategory.image;
        if(categoryImage) {
            await this.fs.deleteFile(categoryImage);
        }
        const category = await this.pg.query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);
        return {
            message: "success",
            data: category
        }
    };
    async updateCategory(id: number | string, data: UpdateCategoryDto,image:Express.Multer.File) {
        const foundedCategory = await this.pg.query("SELECT * FROM categories WHERE id = $1", [id]);
        if (!foundedCategory) {
            throw new NotFoundException("Category not found");
        };

        let imageUrl = foundedCategory.image;

        if(image) {
            if(imageUrl) {
                await this.fs.deleteFile(imageUrl);
            };
            const uploadedImage = await this.fs.uploadFile(image);
            imageUrl = uploadedImage.fileUrl;
        };
        const result = await this.pg.query("UPDATE categories SET name = $1, category_id = $2, image = $3 WHERE id = $4 RETURNING *", [data.name, data.category_id, imageUrl, id]);
        return {
            message: "success",
            data: result
        }
    }
    

}