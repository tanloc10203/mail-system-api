import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { AppConfig } from './app-config.type';
import validateConfig from '@/utils/validate-config';

enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsString()
  @IsOptional()
  APP_NAME: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000,
    nodeEnv: process.env.NODE_ENV ?? Environment.Development,
    apiPrefix: process.env.API_PREFIX ?? 'api',
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost:3000',
    frontendDomain: process.env.FRONTEND_DOMAIN,
    appName: process.env.APP_NAME ?? 'Mail System Api',
  };
});
