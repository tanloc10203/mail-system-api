import 'dotenv/config';
import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AllConfig } from './configs/config.type';
import validationOptions from './utils/validation-options';
import { CatchEverythingFilter } from './utils/filters/catch-every-thing.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'System',
    })
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfig>);

  const apiPrefix = configService.getOrThrow('app.apiPrefix', { infer: true });
  const port = configService.getOrThrow('app.port', { infer: true });
  const appName = configService.getOrThrow('app.appName', { infer: true });
  const frontendDomain = configService.get('app.frontendDomain', {
    infer: true,
  });
  const backendDomain = configService.getOrThrow('app.backendDomain', {
    infer: true,
  });

  app.enableCors({
    origin: frontendDomain,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.enableShutdownHooks();
  app.setGlobalPrefix(apiPrefix, { exclude: ['/'] });
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(new CatchEverythingFilter(app.get(HttpAdapterHost)));

  const options = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    console.log(`Server running on ${backendDomain}`);
    console.log(`Docs running on ${backendDomain}/docs`);
  });
}

void bootstrap();
