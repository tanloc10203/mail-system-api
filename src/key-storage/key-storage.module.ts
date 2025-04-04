import { Module } from '@nestjs/common';
import { KeyStorageService } from './key-storage.service';
import { DocumentKeyStoragePersistenceModule } from './infrastructure';

@Module({
  imports: [DocumentKeyStoragePersistenceModule],
  providers: [KeyStorageService],
  exports: [KeyStorageService, DocumentKeyStoragePersistenceModule],
})
export class KeyStorageModule {}
