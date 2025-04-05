export enum HeaderAccessEnum {
  Bearer = 'bearer',
  Language = 'language',
  ClientId = 'clientId',
  RefreshToken = 'refreshToken',
  LogoutId = 'logoutId',
}

export enum HeaderRequestEnum {
  Authorization = 'authorization',
  Language = 'x-custom-lang',
  ClientId = 'x-client-id',
  RefreshToken = 'refresh-token',
  UserAgent = 'user-agent',
}

export enum HeaderRequestAttachEnum {
  KeyStorage = 'keyStorage',
  DeviceInfo = 'deviceInfo',
  JwtDecoded = 'jwtDecoded',
}
