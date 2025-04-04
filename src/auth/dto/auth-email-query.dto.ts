import { translateLang } from '@/@core/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthEmailVerifyDto {
  @ApiProperty({ example: 'xxxxx', type: String })
  @IsNotEmpty({ message: translateLang.validation.NOT_EMPTY })
  hash: string;
}
