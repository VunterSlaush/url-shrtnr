import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT') as number;

  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}

void bootstrap();
