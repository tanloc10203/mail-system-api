import validateConfig from '@/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_REFRESH_EXPIRES_IN: string;

  @IsString()
  AUTH_ACCESS_EXPIRES_IN: string;

  @IsString()
  AUTH_CONFIRM_EMAIL_EXPIRES_IN: string;

  @IsString()
  AUTH_RESET_PASSWORD_EXPIRES_IN: string;
}

export default registerAs('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    refreshExpiresIn: process.env.AUTH_REFRESH_EXPIRES_IN,
    accessExpiresIn: process.env.AUTH_ACCESS_EXPIRES_IN,
    confirmEmailExpiresIn: process.env.AUTH_CONFIRM_EMAIL_EXPIRES_IN,
    resetPasswordExpiresIn: process.env.AUTH_RESET_PASSWORD_EXPIRES_IN,
  };
});
