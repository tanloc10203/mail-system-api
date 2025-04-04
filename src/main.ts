import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import 'dotenv/config';
import * as morgan from 'morgan';
import { I18nService } from 'nestjs-i18n';
import { CatchHttpError, CatchValidationError } from './@core';
import { ResolvePromisesInterceptor } from './@core/interceptor/';
import { deviceInfoMiddleware } from './@core/middlewares';
import { AppModule } from './app.module';
import { AllConfig } from './configs/config.type';
import validationOptions from './utils/validation-options';

async function bootstrap() {
  const logger = new ConsoleLogger({
    prefix: 'System',
  });

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfig>);
  const i18nService = app.get<I18nService<Record<string, unknown>>>(I18nService);

  const apiPrefix = configService.getOrThrow('app.apiPrefix', { infer: true });
  const port = configService.getOrThrow('app.port', { infer: true });
  const appName = configService.getOrThrow('app.appName', { infer: true });
  const frontendDomain = configService.get('app.frontendDomain', {
    infer: true,
  });
  const backendDomain = configService.getOrThrow('app.backendDomain', {
    infer: true,
  });
  const headerLanguage = configService.getOrThrow('app.headerLanguage', {
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
  app.use(
    morgan('dev', {
      stream: {
        write: (message) => logger.debug(message),
      },
    }),
  );
  app.use(deviceInfoMiddleware);

  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(
    new CatchHttpError(configService),
    new CatchValidationError(configService, i18nService),
  );

  const options = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'bearer',
    )
    .addApiKey({ type: 'apiKey', name: headerLanguage, in: 'header' }, 'language')
    .addApiKey({ type: 'apiKey', name: 'x-client-id', in: 'header' }, 'clientId')
    .addApiKey({ type: 'apiKey', name: 'refresh-token', in: 'header' }, 'refreshToken')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  // Apply security globally to all routes
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      security: [
        {
          bearer: [],
          language: [],
          clientId: [],
          refreshToken: [],
        },
      ],
    },
  });

  await app.listen(port, () => {
    console.log(`Server running on ${backendDomain}`);
    console.log(`Docs running on ${backendDomain}/docs`);
  });
}

void bootstrap();
