import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { GetAllProductsDto } from "./dtos/get-all-products.dtos";
import { CreateProductDto } from "./dtos/create-product.dtos";
import { UpdateProductDto } from "./dtos/update-product.dtos";
import { FilesInterceptor } from "@nestjs/platform-express";
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
    @UseInterceptors(FilesInterceptor('images'))
    async createProduct(@Body() body: CreateProductDto,@UploadedFiles(new CheckFileSizePipe(4 * 1024 * 1024)) images: Express.Multer.File[]) {
        return await this.productService.createProduct(body,images);
    }

    @Put(":id")
    @UseInterceptors(FilesInterceptor('images'))
    async updateProduct(@Param("id") id: number, @Body() body: UpdateProductDto,@UploadedFiles(new CheckFileSizePipe(4 * 1024 * 1024)) images: Express.Multer.File[]) {
        return await this.productService.updateProduct(id,{...body},images);
    }

    @Delete(":id")
    async deleteProduct(@Param("id",ParseIntPipe) id: number) {
        return await this.productService.deleteProduct(id);
    }
}