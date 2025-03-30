import { translateLang } from '@/@core/constants';
import { StatusCodeEnum } from '@/@core/enum';
import { ConflictExceptionCore } from '@/@core/exceptions';
import { ContextProvider } from '@/@core/providers';
import { AuthProvidersEnum } from '@/auth/auth-providers.enum';
import { RoleEnum } from '@/role/role.enum';
import { IPaginationOptions } from '@/utils/types';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { I18nService } from 'nestjs-i18n';
import { User } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence';
import { UserStatusEnum } from './user-status.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly i18nService: I18nService,
  ) {}

  async create(createProfileDto: CreateUserDto) {
    const userObjectExists = await this.userRepository.findByEmail(
      createProfileDto.email,
    );

    if (userObjectExists) {
      const language = ContextProvider.getLanguage();

      const message = this.i18nService.t(translateLang.system.ALREADY_EXISTS, {
        args: {
          property: this.i18nService.t(translateLang.key.email, {
            lang: language,
          }),
        },
        lang: language,
      });

      throw new ConflictExceptionCore({
        message: message,
        code: StatusCodeEnum.ConflictError,
        details: {
          email: message,
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
      photo: createProfileDto.photo,
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
}
