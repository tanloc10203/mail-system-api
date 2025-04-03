import { translateLang } from '@/@core/constants';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@gmail.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty({ message: translateLang.validation.NOT_EMPTY })
  @IsEmail({}, { message: translateLang.validation.INVALID_EMAIL })
  email: string;

  @ApiProperty({ example: '123456', type: String })
  @IsNotEmpty({ message: translateLang.validation.NOT_EMPTY })
  @MinLength(6, {
    message: i18nValidationMessage(translateLang.validation.MIN, { message: 'COOL' }),
  })
  password: string;

  @ApiProperty({ example: 'A', type: String })
  @IsNotEmpty({ message: translateLang.validation.NOT_EMPTY })
  firstName: string;

  @ApiProperty({ example: 'Nguyen Van', type: String })
  @IsNotEmpty({ message: translateLang.validation.NOT_EMPTY })
  lastName: string;
}
