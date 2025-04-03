import { AllConfig } from '@/configs/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'node:fs/promises';
import * as Handlebars from 'handlebars';

@Injectable()
export class MailerService {
  private readonly transport: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService<AllConfig>) {
    this.transport = nodemailer.createTransport({
      host: this.configService.getOrThrow('mail.host', { infer: true }),
      port: this.configService.getOrThrow('mail.port', { infer: true }),
      ignoreTLS: this.configService.getOrThrow('mail.ignoreTLS', {
        infer: true,
      }),
      secure: this.configService.getOrThrow('mail.secure', { infer: true }),
      requireTLS: this.configService.getOrThrow('mail.requireTLS', {
        infer: true,
      }),
      auth: {
        user: this.configService.getOrThrow('mail.user', { infer: true }),
        pass: this.configService.getOrThrow('mail.password', { infer: true }),
      },
    });
  }

  async send(
    mailData: nodemailer.SendMailOptions & {
      templatePath: string;
      context: Record<string, unknown>;
    },
  ): Promise<void> {
    const { templatePath, context, ...mailOptions } = mailData;

    let html: string | undefined;

    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, { strict: true })(context);
    }

    const defaultEmail = this.configService.getOrThrow('mail.defaultEmail', {
      infer: true,
    });

    const defaultName = this.configService.getOrThrow('mail.defaultName', {
      infer: true,
    });

    await this.transport.sendMail({
      ...mailOptions,
      from: `${defaultName} <${defaultEmail}>`,
      html: mailOptions.html || html,
    });
  }
}
