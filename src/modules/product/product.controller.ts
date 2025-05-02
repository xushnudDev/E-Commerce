import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { GetAllProductsDto } from "./dtos/get-all-products.dtos";

@Controller("products")
export class ProductController {
    constructor (private readonly productService: ProductService) {}

    @Get()
    async getAllProducts (@Query() queries:GetAllProductsDto ) {
        return await this.productService.getAllProducts(queries);
    }

    @Get(":id")
    async getProductById (@Param("id") id: number | string) {
        return await this.productService.getProductById({id});
    }

    @Post()
    async createProduct(@Body() body: any) {
        return await this.productService.createProduct(body);
    }

    @Put(":id")
    async updateProduct(@Param("id") id: number | string, @Body() body: any) {
        return await this.productService.updateProduct({id, ...body});
    }

    @Delete(":id")
    async deleteProduct(@Param("id") id: number | string) {
        return await this.productService.deleteProduct({id});
    }
}