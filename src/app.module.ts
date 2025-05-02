import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CategoryModule, ProductModule, UserModule } from "./modules";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "./filters";
import { LogginInterceptor } from "./interceptors/logging.interceptor";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),CategoryModule,ProductModule,UserModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogginInterceptor
    }
  ]
  
})
export class AppModule {}