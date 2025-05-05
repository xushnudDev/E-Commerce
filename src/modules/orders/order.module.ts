import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { PostgresService } from "src/db";

@Module({
    controllers:[OrderController],
    providers: [OrderService,PostgresService]
})

export class OrderModule{}