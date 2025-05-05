import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { PostgresService } from "src/db";
import { FsHelper } from "src/helpers";

@Module({
    imports: [],
    controllers: [ProductController],
    providers: [ProductService,PostgresService,FsHelper]
})
export class ProductModule {}