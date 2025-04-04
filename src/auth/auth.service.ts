import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { UserService } from '@/user/user.service';
import { UserStatusEnum } from '@/user/user-status.enum';
import { AuthProvidersEnum } from './auth-providers.enum';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'node:crypto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AllConfig } from '@/configs/config.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService<AllConfig>,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        details: {
          email: 'User not found',
        },
      });
    }

    if (user.status === UserStatusEnum.inactive) {
      throw new UnauthorizedException({
        message: 'User is inactive',
        details: {
          email: 'User is inactive',
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnauthorizedException({
        message: 'User is not registered with email',
        details: {
          email: 'User is not registered with email',
        },
      });
    }

    if (!user.password) {
      throw new UnauthorizedException({
        message: 'User is not registered with password',
        details: {
          email: 'User is not registered with password',
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid password',
        details: {
          password: 'Invalid password',
        },
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(crypto.randomBytes(32).toString())
      .digest('hex');

    return hash;
  }

  async register(registerDto: AuthRegisterLoginDto) {
    const user = await this.userService.create(registerDto);
    const secret = this.configService.getOrThrow('auth.configEmailSecure', { infer: true });
    const expiresIn = this.configService.getOrThrow('auth.confirmEmailExpiresIn', { infer: true });

    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret,
        expiresIn,
      },
    );

    await this.mailService.userSignUp({
      to: user.email,
      data: {
        hash,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      },
    });

    return true;
  }

  async confirmEmail(hash: string) {
    const secret = this.configService.getOrThrow('auth.configEmailSecure', { infer: true });

    try {
      const payload = await this.jwtService.verifyAsync(hash, {
        secret,
      });

      console.log(payload);

      if (!payload.confirmEmailUserId) {
        throw new UnauthorizedException({
          message: 'Invalid hash',
          details: {
            hash: 'Invalid hash',
          },
        });
      }

      // check expiration date
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new UnauthorizedException({
          message: 'Hash is expired',
          details: {
            hash: 'Hash is expired',
          },
        });
      }

      const user = await this.userService.findById(payload.confirmEmailUserId);

      if (!user) {
        throw new UnauthorizedException({
          message: 'User not found',
          details: {
            email: 'User not found',
          },
        });
      }

      if (user.status === UserStatusEnum.active) {
        throw new UnauthorizedException({
          message: 'User is already active',
          details: {
            email: 'User is already active',
          },
        });
      }

      await this.userService.update(user.id, {
        status: UserStatusEnum.active,
      });

      return true;
    } catch (e) {
      console.log(e);

      // check if error is instance of JsonWebTokenError
      if (e.name === 'JsonWebTokenError') {
        throw new UnauthorizedException({
          message: 'Invalid hash verify',
          details: {
            hash: 'Invalid hash verify',
          },
        });
      }

      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: 'Hash is expired',
          details: {
            hash: 'Hash is expired',
          },
        });
      }

      throw e;
    }
  }

  async resendConfirmEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        details: {
          email: 'User not found',
        },
      });
    }

    if (user.status === UserStatusEnum.active) {
      throw new UnauthorizedException({
        message: 'User is already active',
        details: {
          email: 'User is already active',
        },
      });
    }

    const secret = this.configService.getOrThrow('auth.configEmailSecure', { infer: true });
    const expiresIn = this.configService.getOrThrow('auth.confirmEmailExpiresIn', { infer: true });
    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret,
        expiresIn,
      },
    );

    await this.mailService.userSignUp({
      to: user.email,
      data: {
        hash,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      },
    });

    return true;
  }
}
