export class KeyStorage {
  id: string;
  refreshToken: string;
  refreshTokensUsed: string[];
  publicKey: string;
  privateKey: string;
  jit: string;
  user: string;

  deviceName?: string;
  deviceType?: string;
  operatingSystem?: string;
  browser?: string;
  ipAddress?: string;
  location?: string;
  lastLogin?: Date;
}
