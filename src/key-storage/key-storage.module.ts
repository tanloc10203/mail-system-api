import { Module } from '@nestjs/common';
import { DocumentKeyStoragePersistenceModule } from './infrastructure';
import { KeyStorageService } from './key-storage.service';

@Module({
  imports: [DocumentKeyStoragePersistenceModule],
  providers: [KeyStorageService],
  exports: [KeyStorageService, DocumentKeyStoragePersistenceModule],
})
export class KeyStorageModule {}
