import { IException } from '@/utils/types';
import { UnauthorizedException } from '@nestjs/common';

export class UnAuthorizedExceptionCore extends UnauthorizedException {
  constructor({ message, details, code }: IException) {
    super({
      message,
      details,
      errorCode: code,
    });
  }
}
