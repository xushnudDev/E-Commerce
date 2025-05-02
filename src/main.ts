import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LoggerMiddleware } from "./middleware";
import { HttpExceptionFilter } from "./filters";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  

  const port = parseInt(process.env.APP_PORT as string, 10) || 3000;
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
