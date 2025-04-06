export const translateLang = {
  system: {
    JSON_INVALID: 'system.JSON_INVALID',
    UNEXPECTED_ERROR: 'system.UNEXPECTED_ERROR',
    VALIDATION_FAILED: 'system.VALIDATION_FAILED',
    SYNTAX_ERROR: 'system.SYNTAX_ERROR',
    INTERNAL_SERVER_ERROR: 'system.INTERNAL_SERVER_ERROR',
    ALREADY_EXISTS: 'system.ALREADY_EXISTS',
  },

  validation: {
    NOT_EMPTY: 'validation.NOT_EMPTY',
    INVALID_EMAIL: 'validation.INVALID_EMAIL',
    INVALID_BOOLEAN: 'validation.INVALID_BOOLEAN',
    MIN: 'validation.MIN',
    MAX: 'validation.MAX',
  },

  key: {
    email: 'key.email',
    password: 'key.password',
    provider: 'key.provider',
    socialId: 'key.socialId',
    firstName: 'key.firstName',
    lastName: 'key.lastName',
    photo: 'key.photo',
    role: 'key.role',
    status: 'key.status',
  },

  auth: {
    UNAUTHORIZED: 'auth.UNAUTHORIZED',
    INVALID_CLIENT_ID: 'auth.INVALID_CLIENT_ID',
    INVALID_TOKEN: 'auth.INVALID_TOKEN',
    INVALID_TOKEN_DECODED: 'auth.INVALID_TOKEN_DECODED',
  }
} as const;
