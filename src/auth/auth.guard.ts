import { StatusCodeEnum } from '@/@core/enum';
import { UnAuthorizedExceptionCore } from '@/@core/exceptions';
import { CanActivate } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: any): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = this.extractTokenFromHeader(req.headers.authorization);

    console.log('====================================');
    console.log(`authHeader: `, req.headers);
    console.log('====================================');

    if (!authHeader) {
      throw new UnAuthorizedExceptionCore({
        message: 'Vui lòng đăng nhập để tiếp tục',
        code: StatusCodeEnum.AuthUnAuthorized,
      });
    }

    return true;
  }

  private extractTokenFromHeader(authHeader: string): string | undefined {
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
