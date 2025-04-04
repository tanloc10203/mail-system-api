import { translateLang } from '@/@core/constants';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthResendEmailDto {
  @ApiProperty({ example: 'test1@gmail.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty({ message: translateLang.validation.NOT_EMPTY })
  @IsEmail({}, { message: translateLang.validation.INVALID_EMAIL })
  email: string;
}
