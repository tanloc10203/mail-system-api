import 'dotenv/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AllConfig } from './configs/config.type';
import validationOptions from './utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfig>);

  const apiPrefix = configService.getOrThrow('app.apiPrefix', { infer: true });
  const port = configService.getOrThrow('app.port', { infer: true });

  app.enableShutdownHooks();
  app.setGlobalPrefix(apiPrefix, { exclude: ['/'] });
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  await app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

void bootstrap();
