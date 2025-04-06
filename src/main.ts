import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import 'dotenv/config';
import * as morgan from 'morgan';
import { I18nService } from 'nestjs-i18n';
import { CatchHttpError, CatchValidationError } from './@core';
import { LanguageInterceptor, ResolvePromisesInterceptor } from './@core/interceptor/';
import { deviceInfoMiddleware } from './@core/middlewares';
import { EnvironmentService, TranslationService } from './@core/services';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';

async function bootstrap() {
  const logger = new ConsoleLogger({
    prefix: 'System',
  });

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const environmentService = app.get(EnvironmentService);
  const i18nService = app.get<I18nService<Record<string, unknown>>>(I18nService);

  const { apiPrefix, port, appName, frontendDomain, backendDomain, headerLanguage } =
    environmentService;

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
    new LanguageInterceptor(environmentService),
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(
    new CatchHttpError(environmentService, app.get(TranslationService)),
    new CatchValidationError(environmentService, i18nService),
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
