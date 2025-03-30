import { User } from '@/user/domain/user';
import { UserSchemaClass } from '../entities/user.schema';

export class UserMapper {
  static toDomain(raw: UserSchemaClass): User {
    const domainEntity = new User();

    domainEntity.id = raw._id.toString();
    domainEntity.email = raw.email;
    // domainEntity.password = raw.password;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.socialId;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.photo = raw.photo;
    domainEntity.role = raw.role;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domain: User): UserSchemaClass {
    const persistenceEntity = new UserSchemaClass();

    persistenceEntity._id = domain.id;
    persistenceEntity.email = domain.email;
    persistenceEntity.password = domain.password;
    persistenceEntity.provider = domain.provider;
    persistenceEntity.socialId = domain.socialId;
    persistenceEntity.firstName = domain.firstName;
    persistenceEntity.lastName = domain.lastName;
    persistenceEntity.photo = domain.photo;
    persistenceEntity.role = domain.role;
    persistenceEntity.status = domain.status;
    persistenceEntity.createdAt = domain.createdAt;
    persistenceEntity.updatedAt = domain.updatedAt;
    persistenceEntity.deletedAt = domain.deletedAt;

    return persistenceEntity;
  }
}
