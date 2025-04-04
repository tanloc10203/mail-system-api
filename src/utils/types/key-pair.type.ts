import { IJwtPayload } from './jwt-core.type';

export interface IKeyPairCreatePayload {
  publicKey: string;
  privateKey: string;
  payload: IJwtPayload;
}
