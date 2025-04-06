import { HeaderAccessEnum } from '@/@core/enum';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthClientIdGuard, AuthTokenGuard } from '../guards';
import { UseLanguageInterceptor } from '@/@core/interceptor';

export function Auth() {
  return applyDecorators(
    UseLanguageInterceptor(),
    UseGuards(AuthClientIdGuard),
    UseGuards(AuthTokenGuard),
    ApiBearerAuth(),
    ApiSecurity(HeaderAccessEnum.ClientId),
    ApiSecurity(HeaderAccessEnum.Language),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
}
