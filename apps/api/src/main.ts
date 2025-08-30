import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { initializeSwagger } from 'swagger/initializer';
import { Env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT') as number;

  app.use(cookieParser());

  if (configService.get<Env>('NODE_ENV', { infer: true }) !== 'production') {
    initializeSwagger(app);
  }

  app.enableCors({
    credentials: true,
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200,
    maxAge: 3600,
  });

  await app.listen(PORT, '0.0.0.0');

  console.log(`Server is running on port ${PORT}`);
}

void bootstrap();
