import { IUserAgentDevice } from '@/utils/types';
import { createParamDecorator } from '@nestjs/common';
import { HeaderRequestAttachEnum } from '../enum';

export const UserAgent = createParamDecorator((data: keyof IUserAgentDevice | undefined, req) => {
  const request = req.switchToHttp().getRequest();
  const attachHeader = request?.[HeaderRequestAttachEnum.DeviceInfo];
  if (!attachHeader) return null;
  return data ? attachHeader?.[data] : attachHeader;
});
