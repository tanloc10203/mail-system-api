import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class GenerateCryptoService {
  generate(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  randomUUID() {
    return crypto.randomUUID();
  }
}
