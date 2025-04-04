import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GenerateCryptoService, JwtCoreService, KeyPairService } from './services';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [GenerateCryptoService, JwtCoreService, KeyPairService],
  exports: [GenerateCryptoService, JwtCoreService, KeyPairService],
})
export class CoreModule {}
