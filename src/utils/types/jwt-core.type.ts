import { RoleEnum } from '@/role/role.enum';
import { JwtSignOptions } from '@nestjs/jwt';

export interface IJwtGeneratePayload<T extends object> {
  payload: T;
  secure: string;
  expiresIn?: string;
  options?: JwtSignOptions;
}

export interface IJwtVerifyToken {
  token: string;
  secure: string;
}

export interface IJwtPayload {
  /**
   * Just-in-time token
   */
  jit: string;

  /**
   * User id
   */
  sub: string;

  /**
   * User email
   */
  email: string;

  /**
   * User role
   */
  role: RoleEnum;

  /**
   * Iat timestamp (seconds)
   */
  iat: number;
}

export interface IJwtDecode {
  exp: number;
}

export interface IJwtDecodeUser extends IJwtDecode, IJwtPayload {}

export interface IJwtDecodeEmailVerify extends IJwtDecode {
  confirmEmailUserId: string,
}