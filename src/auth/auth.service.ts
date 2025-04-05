import { GenerateCryptoService, JwtCoreService, KeyPairService } from '@/@core/services';
import { AllConfig } from '@/configs/config.type';
import { KeyStorageService } from '@/key-storage/key-storage.service';
import { MailService } from '@/mail/mail.service';
import { UserStatusEnum } from '@/user/user-status.enum';
import { UserService } from '@/user/user.service';
import { IJwtDecodeEmailVerify, IJwtPayload, IUserAgentDevice } from '@/utils/types';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtCoreService,
    private mailService: MailService,
    private configService: ConfigService<AllConfig>,
    private keyPairService: KeyPairService,
    private cryptoService: GenerateCryptoService,
    private keyStorageService: KeyStorageService,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto, userAgent: IUserAgentDevice) {
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

    const publicKey = this.cryptoService.generate(64);
    const privateKey = this.cryptoService.generate(64);

    const jwtPayload: IJwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role!,
      iat: Math.floor(Date.now() / 1000),
      jit: this.cryptoService.randomUUID(),
    };

    const tokens = await this.keyPairService.create({
      payload: jwtPayload,
      publicKey,
      privateKey,
    });

    const saveTokens = await this.keyStorageService.saveToken({
      user: user.id,
      publicKey,
      privateKey,
      jit: jwtPayload.jit,
      refreshToken: tokens.refreshToken,
      browser: userAgent.browser,
      ipAddress: userAgent.ip,
      operatingSystem: userAgent.os,
      deviceType: userAgent.deviceType,
      deviceName: userAgent.device,
    });

    this.logger.debug(`User ${user.email} logged in`, saveTokens);

    return {
      user,
      tokens,
    };
  }

  async register(registerDto: AuthRegisterLoginDto) {
    const user = await this.userService.create(registerDto);
    const secret = this.configService.getOrThrow('auth.configEmailSecure', { infer: true });
    const expiresIn = this.configService.getOrThrow('auth.confirmEmailExpiresIn', { infer: true });

    const hash = await this.jwtService.generate({
      payload: {
        confirmEmailUserId: user.id,
      },
      secure: secret,
      expiresIn,
    });

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

    const payload = await this.jwtService.validate<IJwtDecodeEmailVerify>({
      secure: secret,
      token: hash,
    });

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

    const hash = await this.jwtService.generate({
      payload: {
        confirmEmailUserId: user.id,
      },
      secure: secret,
      expiresIn,
    });

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
