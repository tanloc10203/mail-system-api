import { HeaderRequestAttachEnum, HeaderRequestEnum, StatusCodeEnum } from '@/@core/enum';
import { UnAuthorizedExceptionCore } from '@/@core/exceptions';
import { KeyStorageService } from '@/key-storage/key-storage.service';
import { IUserAgentDevice } from '@/utils/types';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthClientIdGuard implements CanActivate {
  private readonly logger = new Logger(AuthClientIdGuard.name);

  constructor(private keyStorageService: KeyStorageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const headers = req.headers;
    const deviceInfo = req?.[HeaderRequestAttachEnum.DeviceInfo] as IUserAgentDevice;
    const clientId = headers?.[HeaderRequestEnum.ClientId];
    this.logger.debug(`Client ID: ${clientId}`);

    if (!clientId) {
      throw new UnAuthorizedExceptionCore({
        message: 'Vui lòng đăng nhập để tiếp tục',
        code: StatusCodeEnum.AuthMissingClientId,
      });
    }

    // Check if the client ID is valid
    const clientIdInStorage = await this.keyStorageService.findByUserId(clientId, deviceInfo);
    this.logger.debug(`Client ID in storage: `, clientIdInStorage);

    if (!clientIdInStorage) {
      throw new UnAuthorizedExceptionCore({
        message: 'Client ID không hợp lệ',
        code: StatusCodeEnum.AuthInvalidClientId,
      });
    }

    // Attach the clientId to the request object for later use
    req[HeaderRequestAttachEnum.KeyStorage] = clientIdInStorage;

    return true;
  }
}
