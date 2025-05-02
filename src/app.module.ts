import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CategoryModule, ProductModule, UserModule } from "./modules";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./filters";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),CategoryModule,ProductModule,UserModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}