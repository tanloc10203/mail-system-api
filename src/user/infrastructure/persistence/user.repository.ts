import { User } from '@/user/domain/user';
import { FilterUserDto, SortUserDto } from '@/user/dto/query-user.dto';
import { DeepPartial, IPaginationOptions, NullableType } from '@/utils/types';

export abstract class UserRepository {
  abstract create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<User>;

  abstract findByEmail(email: User['email']): Promise<NullableType<User>>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{
    data: User[];
    total: number;
  }>;

  abstract update(id: User['id'], payload: DeepPartial<User>): Promise<NullableType<User>>;

  abstract remove(id: User['id']): Promise<void>;
}
