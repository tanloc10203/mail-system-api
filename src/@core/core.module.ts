import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClsModule } from 'nestjs-cls';
import {
  EnvironmentService,
  GenerateCryptoService,
  JwtCoreService,
  KeyPairService,
  TranslationService,
} from './services';

const services = [
  GenerateCryptoService,
  JwtCoreService,
  KeyPairService,
  TranslationService,
  EnvironmentService,
];

const infrastructureClsModule = ClsModule.forRoot({
  global: true,
  middleware: {
    mount: true,
  },
});

@Global()
@Module({
  imports: [infrastructureClsModule, JwtModule.register({})],
  providers: services,
  exports: services,
})
export class CoreModule {}
