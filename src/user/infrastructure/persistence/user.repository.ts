import { User } from '@/user/domain/user';
import { DeepPartial, NullableType } from '@/utils/types';

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<User>;

  abstract findByEmail(email: User['email']): Promise<NullableType<User>>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<NullableType<User>>;

  abstract remove(id: User['id']): Promise<void>;
}
