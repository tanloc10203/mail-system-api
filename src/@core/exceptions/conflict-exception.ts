import { IException } from '@/utils/types';
import { ConflictException } from '@nestjs/common';

export class ConflictExceptionCore extends ConflictException {
  constructor({ message, details, code }: IException) {
    super({
      message,
      details,
      errorCode: code,
    });
  }
}
