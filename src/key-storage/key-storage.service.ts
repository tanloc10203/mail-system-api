import { Injectable } from '@nestjs/common';
import { KeyStorage } from './domain/key-storage';
import { KeyStorageRepository } from './infrastructure/key-storage.repository';

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
}
