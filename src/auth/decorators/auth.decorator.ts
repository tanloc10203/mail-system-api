import { HeaderAccessEnum } from '@/@core/enum';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthClientIdGuard, AuthTokenGuard } from '../guards';

export function Auth() {
  return applyDecorators(
    UseGuards(AuthClientIdGuard),
    UseGuards(AuthTokenGuard),
    ApiBearerAuth(),
    ApiSecurity(HeaderAccessEnum.ClientId),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
}
