import { KeyStorage } from '@/key-storage/domain/key-storage';
import { KeyStorageSchemaClass } from '../entities/key-storage.schema';
import { User } from '@/user/domain/user';
import { UserSchemaClass } from '@/user/infrastructure/persistence';

export class KeyStorageMapper {
  static toDomain(raw: KeyStorageSchemaClass): KeyStorage {
    const domainEntity = new KeyStorage();

    domainEntity.id = raw._id.toString();
    domainEntity.browser = raw.browser;
    domainEntity.deviceType = raw.deviceType;
    domainEntity.deviceName = raw.deviceName;
    domainEntity.ipAddress = raw.ipAddress;
    domainEntity.jit = raw.jit;
    domainEntity.lastLogin = raw.lastLogin;

    if (raw.user) {
      domainEntity.user = raw.user._id.toString();
    }

    domainEntity.location = raw.location;
    domainEntity.operatingSystem = raw.operatingSystem;
    domainEntity.privateKey = raw.privateKey;
    domainEntity.publicKey = raw.publicKey;
    domainEntity.refreshTokensUsed = raw.refreshTokensUsed;
    domainEntity.refreshToken = raw.refreshToken;

    return domainEntity;
  }

  static toPersistence(domain: KeyStorage): KeyStorageSchemaClass {
    const persistenceEntity = new KeyStorageSchemaClass();

    persistenceEntity._id = domain.id;
    persistenceEntity.browser = domain.browser;
    persistenceEntity.deviceType = domain.deviceType;
    persistenceEntity.deviceName = domain.deviceName;
    persistenceEntity.ipAddress = domain.ipAddress;
    persistenceEntity.jit = domain.jit;
    persistenceEntity.lastLogin = domain.lastLogin;
    persistenceEntity.location = domain.location;
    persistenceEntity.operatingSystem = domain.operatingSystem;
    persistenceEntity.privateKey = domain.privateKey;
    persistenceEntity.publicKey = domain.publicKey;
    persistenceEntity.refreshTokensUsed = domain.refreshTokensUsed;
    persistenceEntity.refreshToken = domain.refreshToken;

    if (domain.user) {
      persistenceEntity.user = new UserSchemaClass();
      persistenceEntity.user._id = domain.user;
    }

    return persistenceEntity;
  }
}
