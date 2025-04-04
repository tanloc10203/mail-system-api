import { IException, IJwtGeneratePayload, IJwtVerifyToken } from '@/utils/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StatusCodeEnum } from '../enum';

@Injectable()
export class JwtCoreService {
  constructor(private readonly jwt: JwtService) {}

  generate<T extends Record<string, unknown>>({
    payload,
    secure,
    expiresIn,
    options,
  }: IJwtGeneratePayload<T>): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: secure,
      expiresIn,
      ...options,
    });
  }

  async validate<T extends Record<string, unknown>>({ secure, token }: IJwtVerifyToken) {
    try {
      const decoded = await this.jwt.verifyAsync(token, {
        secret: secure,
      });

      return decoded as T;
    } catch (error) {
      const errorDetails = this.getJwtErrorDetails(error);
      throw new UnauthorizedException(errorDetails);
    }
  }

  private getJwtErrorDetails(error: any): IException {
    if (error.name === 'TokenExpiredError') {
      return {
        message: 'Token has expired',
        code: StatusCodeEnum.JwtTokenExpired,
      };
    }

    if (error.name === 'JsonWebTokenError') {
      return this.handleJsonWebTokenError(error);
    }

    if (error.name === 'NotBeforeError') {
      return {
        message: 'Token not active yet',
        code: StatusCodeEnum.JwtTokenNotActive,
      };
    }

    return {
      message: error.message,
      code: StatusCodeEnum.InternalServerError,
    };
  }

  private handleJsonWebTokenError(error: any): IException {
    if (error.message.includes('signature')) {
      return {
        message: 'Invalid token signature',
        code: StatusCodeEnum.JwtTokenInvalidSignature,
      };
    }

    if (error.message.includes('payload')) {
      return {
        message: 'Invalid token payload',
        code: StatusCodeEnum.JwtTokenInvalidPayload,
      };
    }

    if (error.message.includes('secret or public key')) {
      return {
        message: 'Invalid token secure key',
        code: StatusCodeEnum.JwtTokenInvalidSecure,
      };
    }

    return {
      message: 'Invalid token',
      code: StatusCodeEnum.JwtTokenInvalid,
    };
  }
}
