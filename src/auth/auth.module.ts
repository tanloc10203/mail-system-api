import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/user/user.module';
import { MailModule } from '@/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, MailModule, JwtModule.register({})],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
