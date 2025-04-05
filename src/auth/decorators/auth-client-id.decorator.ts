import { HeaderRequestAttachEnum } from '@/@core/enum';
import { KeyStorage } from '@/key-storage/domain/key-storage';
import { createParamDecorator } from '@nestjs/common';

export const KeyStorageParam = createParamDecorator((data: keyof KeyStorage | undefined, req) => {
    const request = req.switchToHttp().getRequest();
    const attachHeader = request?.[HeaderRequestAttachEnum.KeyStorage];
    if (!attachHeader) return null;
    return data ? attachHeader?.[data] : attachHeader;
});
