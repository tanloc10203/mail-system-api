import { ConflictExceptionCore } from '@/@core/exceptions';
import { AuthProvidersEnum } from '@/auth/auth-providers.enum';
import { RoleEnum } from '@/role/role.enum';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './infrastructure/persistence';
import { UserStatusEnum } from './user-status.enum';
import { StatusCodeEnum } from '@/@core/enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createProfileDto: CreateUserDto) {
    const userObjectExists = await this.userRepository.findByEmail(
      createProfileDto.email,
    );

    if (userObjectExists) {
      throw new ConflictExceptionCore({
        message: 'Email already exists',
        code: StatusCodeEnum.ConflictError,
        details: {
          email: 'Email already exists',
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
}
