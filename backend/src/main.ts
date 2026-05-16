import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  });

  // ── CRITICAL: enables class-validator + class-transformer on every endpoint
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strips unknown fields — prevents anonymous/null bug
      forbidNonWhitelisted: false,
      transform: true,          // auto-converts types (e.g. string → number for maxChildren)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
