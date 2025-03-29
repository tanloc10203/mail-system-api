import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/config/database.config';
import appConfig from './configs/app.config';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

const infrastructureConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, databaseConfig],
});

@Module({
  imports: [
    infrastructureConfigModule,
    infrastructureDatabaseModule,
    UserModule,
  ],
})
export class AppModule {}
