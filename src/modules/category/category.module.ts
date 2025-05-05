import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { PostgresService } from "src/db";
import { LoggerMiddleware } from "src/middleware";
import { FsHelper } from "src/helpers";

@Module({
    imports: [],
    controllers: [CategoryController],
    providers: [CategoryService,PostgresService,FsHelper]
})
export class CategoryModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(CategoryController);
    }
}