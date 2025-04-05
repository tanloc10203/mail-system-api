import { NullableType } from '@/utils/types';
import { KeyStorage } from '../domain/key-storage';

export abstract class KeyStorageRepository {
  abstract save(
    data: Omit<KeyStorage, 'id'>,
  ): Promise<NullableType<KeyStorage>>;
}
