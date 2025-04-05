import { AuthProvidersEnum } from '@/auth/auth-providers.enum';
import { RoleEnum } from '@/role/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserStatusEnum } from '../user-status.enum';

export class User {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string;

  @Exclude({ toPlainOnly: true })
  @ApiProperty({
    type: String,
    description: 'Password (excluded from responses)',
    writeOnly: true
  })
  password?: string;

  @ApiProperty({
    type: String,
    example: AuthProvidersEnum.email,
  })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiProperty({
    type: String,
    example: 'https://example.com/photo.jpg',
  })
  photo?: string | null;

  @ApiProperty({
    type: String,
    example: RoleEnum.user,
  })
  role?: RoleEnum;

  @ApiProperty({
    type: String,
    example: UserStatusEnum.inactive,
  })
  @Expose({ groups: ['me', 'admin'] })
  status?: UserStatusEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
