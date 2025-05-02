import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory(errors) {
      let errorMessage = '';
      errors.forEach((error) => {
        if (error.constraints) {
          errorMessage += `${error.property} has wrong value ${error.value}, ${Object.values(error.constraints).join(', ')}\n`;
        }
      });
      return new BadRequestException(errorMessage.trim());
    }
    
    
  }));
  

  const port = parseInt(process.env.APP_PORT as string, 10) || 3000;
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
