import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import appConfig from './configs/app.config';
import { AllConfig } from './configs/config.type';
import databaseConfig from './database/config/database.config';
import { MongooseConfigService } from './database/mongoose-config.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from './mailer/mailer.module';
import authConfig from './auth/config/auth.config';
import mailConfig from './mail/config/mail.config';
import { CoreModule } from './@core/core.module';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

const infrastructureConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, databaseConfig, authConfig, mailConfig],
});

const infrastructureI18nModule = I18nModule.forRootAsync({
  useFactory: (configService: ConfigService<AllConfig>) => ({
    fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
      infer: true,
    }),
    loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
  }),
  resolvers: [
    {
      use: HeaderResolver,
      useFactory: (configService: ConfigService<AllConfig>) => {
        return [
          configService.get('app.headerLanguage', {
            infer: true,
          }),
        ];
      },
      inject: [ConfigService],
    },
  ],
  imports: [ConfigModule],
  inject: [ConfigService],
});

const infrastructureClsModule = ClsModule.forRoot({
  global: true,
  middleware: {
    mount: true,
  },
});

@Module({
  imports: [
    infrastructureConfigModule,
    infrastructureDatabaseModule,
    infrastructureI18nModule,
    infrastructureClsModule,
    CoreModule,
    UserModule,
    AuthModule,
    MailModule,
    MailerModule,
  ],
})
export class AppModule {}
