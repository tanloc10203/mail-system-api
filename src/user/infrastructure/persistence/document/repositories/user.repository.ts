import { User } from '@/user/domain/user';
import { IPaginationOptions, NullableType } from '@/utils/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserRepository } from '../../user.repository';
import { UserSchemaClass } from '../entities/user.schema';
import { UserMapper } from '../mappers/user.mapper';
import { FilterUserDto, SortUserDto } from '@/user/dto/query-user.dto';

@Injectable()
export class UserRepositoryDocument implements UserRepository {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly userModel: Model<UserSchemaClass>,
  ) {}

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const createdUser = new this.userModel(persistenceModel);
    const userObject = await createdUser.save();
    return UserMapper.toDomain(userObject);
  }

  async findManyWithPagination({
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
  }> {
    const where: FilterQuery<UserSchemaClass> = {};
    if (filterOptions?.roles?.length) {
      where['role'] = {
        $in: filterOptions.roles,
      };
    }

    const userObjects = await this.userModel
      .find(where)
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy === 'id' ? '_id' : sort.orderBy]:
              sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    const data = userObjects.map((userObject) => UserMapper.toDomain(userObject));
    const total = await this.userModel.countDocuments(where);

    return {
      data,
      total,
    };
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const userObject = await this.userModel.findById(id);
    return userObject ? UserMapper.toDomain(userObject) : null;
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    const userObject = await this.userModel.findOne({ email });
    return userObject ? UserMapper.toDomain(userObject) : null;
  }

  async remove(id: User['id']): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<NullableType<User>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const user = await this.userModel.findOne(filter);

    if (!user) {
      return null;
    }

    const userObject = await this.userModel.findOneAndUpdate(
      filter,
      UserMapper.toPersistence({
        ...UserMapper.toDomain(user),
        ...clonedPayload,
      }),
      { new: true },
    );

    return userObject ? UserMapper.toDomain(userObject) : null;
  }
}
