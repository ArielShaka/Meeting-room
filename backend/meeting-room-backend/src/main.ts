import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: 'http://localhost:3001', // allow your frontend to access backend
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
