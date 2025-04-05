import { Injectable } from '@nestjs/common';
import { KeyStorage } from './domain/key-storage';
import { KeyStorageRepository } from './infrastructure/key-storage.repository';
import { IUserAgentDevice } from '@/utils/types';

@Injectable()
export class KeyStorageService {
  constructor(private readonly keyStorageRepository: KeyStorageRepository) {}

  saveToken(saveKeyStorageDto: Omit<KeyStorage, 'id' | 'refreshTokensUsed' | 'lastLogin'>) {
    return this.keyStorageRepository.save({
      ...saveKeyStorageDto,
      refreshTokensUsed: [],
      lastLogin: new Date(),
    });
  }

  findByUserId(userId: string, deviceInfo: IUserAgentDevice) {
    return this.keyStorageRepository.findByUserId(userId, deviceInfo);
  }
}
