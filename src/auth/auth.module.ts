import { CoreModule } from '@/@core/core.module';
import { KeyStorageModule } from '@/key-storage/key-storage.module';
import { MailModule } from '@/mail/mail.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, MailModule, CoreModule, KeyStorageModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
