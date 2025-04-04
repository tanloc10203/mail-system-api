import { KeyStorage } from '@/key-storage/domain/key-storage';
import { NullableType } from '@/utils/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose } from 'mongoose';
import { KeyStorageRepository } from '../../key-storage.repository';
import { KEY_STORAGE_DOCUMENT_NAME, KeyStorageSchemaClass } from '../entities/key-storage.schema';
import { KeyStorageMapper } from '../mapper/key-storage.mapper';

@Injectable()
export class KeyStorageRepositoryDocument implements KeyStorageRepository {
  constructor(
    @InjectModel(KEY_STORAGE_DOCUMENT_NAME)
    private readonly keyStorageModel: Model<KeyStorageSchemaClass>,
  ) {}

  async save(data: KeyStorage): Promise<NullableType<KeyStorage>> {
    const filter = { user: data.user };

    const update = {
      $set: {
        privateKey: data.privateKey,
        publicKey: data.publicKey,
        refreshToken: data.refreshToken,
        refreshTokensUsed: [],
        lastLogin: new Date(),
        jit: data.jit,
        user: data.user,
      },
    };

    const options = { upsert: true, new: true };

    const keyStorage = await this.keyStorageModel.findOneAndUpdate(filter, update, options);

    return keyStorage ? KeyStorageMapper.toDomain(keyStorage) : null;
  }
}
