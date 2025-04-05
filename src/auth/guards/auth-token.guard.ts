import { HeaderRequestAttachEnum, HeaderRequestEnum, StatusCodeEnum } from '@/@core/enum';
import { UnAuthorizedExceptionCore } from '@/@core/exceptions';
import { JwtCoreService } from '@/@core/services';
import { KeyStorage } from '@/key-storage/domain/key-storage';
import { IJwtDecodeUser } from '@/utils/types';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  private readonly logger = new Logger(AuthTokenGuard.name);

  constructor(private jwtService: JwtCoreService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const keyStorage: KeyStorage | undefined = req?.[HeaderRequestAttachEnum.KeyStorage];
    this.logger.debug(`KeyStorage: `, keyStorage);

    if (!keyStorage) {
      this.logger.debug('KeyStorage is undefined or null');
      throw new UnAuthorizedExceptionCore({
        message: 'Vui lòng đăng nhập để tiếp tục',
        code: StatusCodeEnum.AuthUnAuthorized,
      });
    }

    const token = req.headers?.[HeaderRequestEnum.Authorization];
    const authHeader = this.extractTokenFromHeader(token);
    this.logger.debug(`Authorization Header: ${authHeader}`);

    if (!authHeader) {
      throw new UnAuthorizedExceptionCore({
        message: 'Vui lòng đăng nhập để tiếp tục',
        code: StatusCodeEnum.AuthUnAuthorized,
      });
    }

    const decodedToken = await this.jwtService.validate<IJwtDecodeUser>({
      token: authHeader,
      secure: keyStorage.publicKey,
    });
    this.logger.debug(`Decoded Token: `, decodedToken);

    // Check jit valid with keyStorage
    if (decodedToken.jit !== keyStorage.jit) {
      throw new UnAuthorizedExceptionCore({
        message: 'Mã xác thực không hợp lệ',
        code: StatusCodeEnum.AuthJitInvalid,
      });
    }

    // Check userId valid with keyStorage
    if (decodedToken.sub !== keyStorage.user.toString()) {
      throw new UnAuthorizedExceptionCore({
        message: 'Người dùng không hợp lệ',
        code: StatusCodeEnum.AuthDecodeInvalidClientId,
      });
    }

    // Attach user to request
    req[HeaderRequestAttachEnum.JwtDecoded] = decodedToken;

    return true;
  }

  private extractTokenFromHeader(authHeader: string): string | undefined {
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
