import { translateLang } from '@/@core/constants';
import { StatusCodeEnum } from '@/@core/enum';
import { ConflictExceptionCore } from '@/@core/exceptions';
import { AuthProvidersEnum } from '@/auth/auth-providers.enum';
import { RoleEnum } from '@/role/role.enum';
import { formatTranslate } from '@/utils/format-translate';
import { IPaginationOptions, NullableType } from '@/utils/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './infrastructure/persistence';
import { UserStatusEnum } from './user-status.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createProfileDto: CreateUserDto) {
    const userObjectExists = await this.userRepository.findByEmail(createProfileDto.email);

    if (userObjectExists) {
      const errorMessage = formatTranslate(translateLang.system.ALREADY_EXISTS, {
        property: {
          key: translateLang.key.email,
          isTranslate: true,
        },
      });

      throw new ConflictExceptionCore({
        message: errorMessage,
        code: StatusCodeEnum.ConflictError,
        details: {
          email: errorMessage,
        },
      });
    }

    let password: string | undefined = undefined;

    if (createProfileDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createProfileDto.password, salt);
    }

    return this.userRepository.create({
      email: createProfileDto.email,
      password,
      firstName: createProfileDto.firstName,
      lastName: createProfileDto.lastName,
      provider: createProfileDto.provider ?? AuthProvidersEnum.email,
      photo: createProfileDto.photo ?? '',
      role: createProfileDto.role ?? RoleEnum.user,
      socialId: createProfileDto.socialId ?? undefined,
      status: createProfileDto.status ?? UserStatusEnum.inactive,
    });
  }

  findManyWithPagination({
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
    return this.userRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findById(id: User['id']): Promise<User> {
    const userObject = await this.userRepository.findById(id);

    if (!userObject) {
      throw new NotFoundException('User not found');
    }

    return userObject;
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.userRepository.findByEmail(email);
  }

  async update(id: User['id'], payload: UpdateUserDto): Promise<User> {
    const userObject = await this.userRepository.findById(id);

    if (!userObject) {
      throw new NotFoundException('User not found');
    }

    let password: string | undefined = undefined;

    if (payload.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(payload.password, salt);
    }

    let email: string | undefined = undefined;

    if (payload.email) {
      const userObjectExists = await this.userRepository.findByEmail(payload.email);

      if (userObjectExists && userObjectExists.id !== id) {
        const errorMessage = formatTranslate(translateLang.system.ALREADY_EXISTS, {
          property: {
            key: translateLang.key.email,
            isTranslate: true,
          },
        });

        throw new ConflictExceptionCore({
          message: errorMessage,
          code: StatusCodeEnum.ConflictError,
          details: {
            email: errorMessage,
          },
        });
      }

      if (email !== userObject.email) {
        email = payload.email;
      }
    }

    let photo: string | undefined = undefined;

    if (payload.photo) {
      photo = payload.photo;
    }

    let firstName: string | undefined = undefined;

    if (payload.firstName) {
      firstName = payload.firstName;
    }

    let lastName: string | undefined = undefined;

    if (payload.lastName) {
      lastName = payload.lastName;
    }

    let status: UserStatusEnum | undefined = undefined;
    if (payload.status) {
      status = payload.status;
    }

    const userObjectUpdated = await this.userRepository.update(id, {
      email,
      password,
      photo,
      firstName,
      lastName,
      status,
    });

    if (!userObjectUpdated) {
      throw new NotFoundException('User not found');
    }

    return userObjectUpdated;
  }

  async remove(id: User['id']): Promise<boolean> {
    const deleted = await this.userRepository.remove(id);

    if (!deleted) {
      throw new NotFoundException('User not found');
    }

    return deleted;
  }
}
