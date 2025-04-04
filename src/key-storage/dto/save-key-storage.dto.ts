import { User } from '@/user/domain/user';
import { IsNotEmpty, IsString } from 'class-validator';

export class SaveKeyStorageDto {
  @IsString()
  @IsNotEmpty()
  privateKey: string;

  @IsString()
  @IsNotEmpty()
  publicKey: string;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsString()
  @IsNotEmpty()
  jit: string;
}
