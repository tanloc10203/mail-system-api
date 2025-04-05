import { HeaderAccessEnum } from '@/@core/enum';
import { applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function AuthWithRefreshToken() {
  return applyDecorators(
    ApiSecurity(HeaderAccessEnum.ClientId),
    ApiSecurity(HeaderAccessEnum.RefreshToken),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
}
