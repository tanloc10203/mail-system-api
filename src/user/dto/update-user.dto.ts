import { RoleEnum } from '@/role/role.enum';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UserStatusEnum } from '../user-status.enum';
import { translateLang } from '@/@core/constants';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty({ message: translateLang.validation.NOT_EMPTY })
  @IsEmail({}, { message: translateLang.validation.INVALID_EMAIL })
  email?: string;

  @ApiProperty()
  @MinLength(6, {
    message: i18nValidationMessage(translateLang.validation.MIN, { message: 'COOL' }),
  })
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John', type: String })
  @IsNotEmpty({ message: translateLang.validation.NOT_EMPTY })
  firstName?: string | null;

  @ApiProperty({ example: 'Doe', type: String })
  @IsNotEmpty({ message: translateLang.validation.NOT_EMPTY })
  lastName?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  photo?: string | null;

  @ApiPropertyOptional({ type: Number, default: RoleEnum.user })
  @IsOptional()
  role?: number | null;

  @ApiPropertyOptional({ type: Number, default: UserStatusEnum.inactive })
  @IsOptional()
  status?: number | null;
}
