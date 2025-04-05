import { HeaderRequestAttachEnum } from '@/@core/enum';
import { IJwtDecodeUser } from '@/utils/types';
import { createParamDecorator } from '@nestjs/common';

export const JwtDecodeParam = createParamDecorator(
  (data: keyof IJwtDecodeUser | undefined, req) => {
    const request = req.switchToHttp().getRequest();
    const attachHeader = request?.[HeaderRequestAttachEnum.JwtDecoded];
    if (!attachHeader) return null;
    return data ? attachHeader?.[data] : attachHeader;
  },
);
