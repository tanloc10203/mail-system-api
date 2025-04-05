import { HeaderAccessEnum } from "@/@core/enum";
import { applyDecorators } from "@nestjs/common";
import { ApiSecurity, ApiUnauthorizedResponse } from "@nestjs/swagger";

export function AuthWithLogout() {
  return applyDecorators(
    ApiSecurity(HeaderAccessEnum.ClientId),
    ApiSecurity(HeaderAccessEnum.LogoutId),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
}
