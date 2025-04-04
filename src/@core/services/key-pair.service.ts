import { IKeyPairCreatePayload } from '@/utils/types';
import { Injectable } from '@nestjs/common';
import { JwtCoreService } from './jwt-core.service';
import { ConfigService } from '@nestjs/config';
import { AllConfig } from '@/configs/config.type';

@Injectable()
export class KeyPairService {
  constructor(
    private readonly jwtCoreService: JwtCoreService,
    private readonly configService: ConfigService<AllConfig>,
  ) {}

  async create({ payload, privateKey, publicKey }: IKeyPairCreatePayload) {
    const refreshExpiresIn = this.configService.getOrThrow('auth.refreshExpiresIn', {
      infer: true,
    });

    const accessExpiresIn = this.configService.getOrThrow('auth.accessExpiresIn', {
      infer: true,
    });

    const accessToken = await this.jwtCoreService.generate({
      payload,
      secure: publicKey,
      expiresIn: accessExpiresIn,
    });

    const refreshToken = await this.jwtCoreService.generate({
      payload,
      secure: privateKey,
      expiresIn: refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
