import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../user.repository';
import { USER_DOCUMENT_NAME, UserSchema } from './entities/user.schema';
import { UserRepositoryDocument } from './repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_DOCUMENT_NAME,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryDocument,
    },
  ],
  exports: [UserRepository],
})
export class DocumentUserPersistenceModule {}
