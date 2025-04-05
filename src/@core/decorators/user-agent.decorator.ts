import { IUserAgentDevice } from '@/utils/types';
import { createParamDecorator } from '@nestjs/common';

export const UserAgent = createParamDecorator((data: keyof IUserAgentDevice | undefined, req) => {
  const request = req.switchToHttp().getRequest();
  if (!request.deviceInfo) return null;
  return data ? request.deviceInfo[data] : request.deviceInfo;
});
