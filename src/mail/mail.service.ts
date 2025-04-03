import { MailerService } from '@/mailer/mailer.service';
import { Injectable } from '@nestjs/common';
import { MailData } from './interfaces/mail-data.interface';
import { ConfigService } from '@nestjs/config';
import { AllConfig } from '@/configs/config.type';
import * as path from 'path';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService<AllConfig>,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string; firstName: string; lastName: string }>) {
    const frontendDomain = this.configService.get('app.frontendDomain', { infer: true });
    const workingDirectory = this.configService.get('app.workingDirectory', { infer: true });
    const appName = this.configService.get('app.appName', { infer: true });
    const expiryTime = this.configService.get('auth.confirmEmailExpiresIn', { infer: true });

    const url = new URL(frontendDomain + '/confirm-email');
    url.searchParams.set('hash', mailData.data.hash);

    const templatePath = path.join(
      workingDirectory!,
      'src',
      'mail',
      'mail-templates',
      'activation.hbs',
    );

    await this.mailerService.send({
      to: mailData.to,
      subject: 'Confirm your email',
      templatePath,
      context: {
        activationCode: mailData.data.hash,
        companyAddress: '123 Main St, Anytown USA',
        logoUrl: `${frontendDomain}/assets/logo.png`,
        title: 'Confirm your email',
        companyName: appName,
        userName: `${mailData.data.firstName} ${mailData.data.lastName}`,
        activationUrl: url.toString(),
        expiryTime: expiryTime,
        currentYear: new Date().getFullYear(),
        privacyPolicyUrl: `${frontendDomain}/privacy-policy`,
        termsOfServiceUrl: `${frontendDomain}/terms-of-service`,
        contactUrl: `${frontendDomain}/contact`,
      },
    });
  }
}
