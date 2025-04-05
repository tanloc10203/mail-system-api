import { KeyStorage } from '@/key-storage/domain/key-storage';
import { DeepPartial, IUserAgentDevice, NullableType } from '@/utils/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    const persistenceModel = KeyStorageMapper.toPersistence(data);

    const filter: DeepPartial<KeyStorageSchemaClass> = {
      user: persistenceModel.user,
      browser: persistenceModel.browser,
      ipAddress: persistenceModel.ipAddress,
      deviceName: persistenceModel.deviceName,
      operatingSystem: persistenceModel.operatingSystem,
      deviceType: persistenceModel.deviceType,
    };

    const update = {
      $set: KeyStorageMapper.toPersistence(data),
    };

    const options = { upsert: true, new: true };

    const keyStorage = await this.keyStorageModel.findOneAndUpdate(filter, update, options);

    return keyStorage ? KeyStorageMapper.toDomain(keyStorage) : null;
  }

  async findByUserId(userId: string, deviceInfo: IUserAgentDevice): Promise<NullableType<KeyStorage>> {
    const filter = {
      user: userId,
      browser: deviceInfo.browser,
      ipAddress: deviceInfo.ip,
      deviceName: deviceInfo.device,
      operatingSystem: deviceInfo.os,
      deviceType: deviceInfo.deviceType,
    };

    const keyStorage = await this.keyStorageModel.findOne(filter);

    return keyStorage ? KeyStorageMapper.toDomain(keyStorage) : null;
  }
}
