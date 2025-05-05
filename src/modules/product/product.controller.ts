import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { GetAllProductsDto } from "./dtos/get-all-products.dtos";
import { CreateProductDto } from "./dtos/create-product.dtos";
import { UpdateProductDto } from "./dtos/update-product.dtos";
import { FileInterceptor } from "@nestjs/platform-express";
import { CheckFileSizePipe } from "../pipes/check-file-size.pipe";

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
    @UseInterceptors(FileInterceptor('image'))
    async createProduct(@Body() body: CreateProductDto,@UploadedFile(new CheckFileSizePipe(4 * 1024 * 1024)) image: Express.Multer.File) {
        return await this.productService.createProduct(body,image);
    }

    @Put(":id")
    async updateProduct(@Param("id") id: number | string, @Body() body: UpdateProductDto) {
        return await this.productService.updateProduct(id,{...body});
    }

    @Delete(":id")
    async deleteProduct(@Param("id") id: number | string) {
        return await this.productService.deleteProduct({id});
    }
}