export enum StatusCodeEnum {
  ValidateFailed = 111111,
  InternalServerError = 500000,
  ConflictError = 409000,
  SyntaxError = 400000,

  // Jwt
  JwtTokenExpired = 401001,
  JwtTokenInvalid = 401002,
  JwtTokenInvalidSignature = 401003,
  JwtTokenInvalidPayload = 401004,
  JwtTokenInvalidSecure = 401005,
  JwtTokenNotActive = 401006,

  // Auth
  AuthUnAuthorized = 401000,
}
