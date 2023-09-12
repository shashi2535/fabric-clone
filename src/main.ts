import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { LoggerMiddleware } from './middleware/token.middleware';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.use(new LoggerMiddleware());
  await app.listen(3000);
}
bootstrap();
