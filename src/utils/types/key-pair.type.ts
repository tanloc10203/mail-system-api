export interface IKeyPairCreatePayload {
  publicKey: string;
  privateKey: string;
  payload: Record<string, unknown>;
}
