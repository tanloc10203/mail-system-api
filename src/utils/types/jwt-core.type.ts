import { JwtSignOptions } from '@nestjs/jwt';

export interface IJwtGeneratePayload<T extends Record<string, unknown>> {
  payload: T;
  secure: string;
  expiresIn?: string;
  options?: JwtSignOptions;
}

export interface IJwtVerifyToken {
  token: string;
  secure: string;
}
