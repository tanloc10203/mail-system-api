import { Injectable } from '@nestjs/common';
import { SaveKeyStorageDto } from './dto/save-key-storage.dto';
import { KeyStorageRepository } from './infrastructure/key-storage.repository';

@Injectable()
export class KeyStorageService {
  constructor(private readonly keyStorageRepository: KeyStorageRepository) {}

  saveToken(saveKeyStorageDto: SaveKeyStorageDto) {
    return this.keyStorageRepository.save(saveKeyStorageDto);
  }
}
