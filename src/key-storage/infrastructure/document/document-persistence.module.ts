import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyStorageRepository } from '../key-storage.repository';
import {
  KEY_STORAGE_DOCUMENT_NAME,
  KeyStorageSchema
} from './entities/key-storage.schema';
import { KeyStorageRepositoryDocument } from './repository/key-storage.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: KEY_STORAGE_DOCUMENT_NAME,
        schema: KeyStorageSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: KeyStorageRepository,
      useClass: KeyStorageRepositoryDocument,
    },
  ],
  exports: [KeyStorageRepository],
})
export class DocumentKeyStoragePersistenceModule {}
