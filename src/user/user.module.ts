import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DocumentUserPersistenceModule } from './infrastructure/persistence';

@Module({
  imports: [DocumentUserPersistenceModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, DocumentUserPersistenceModule],
})
export class UserModule {}
