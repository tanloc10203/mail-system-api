import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@/mailer/mailer.module';

@Module({
  imports: [MailerModule], // add MailModule to the imports array of your AppModule.ts file to make it available to the rest of your application
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
