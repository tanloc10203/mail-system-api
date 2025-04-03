import { DatabaseConfig } from '@/database/config/database-config.type';
import { AppConfig } from './app-config.type';
import { AuthConfig } from '@/auth/config/auth-config.type';
import { MailConfigType } from '@/mail/config/mail-config.type';

export type AllConfig = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  mail: MailConfigType;
};
