import { AllConfig } from '@/configs/config.type';
import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiHeader } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { LanguageEnum } from '../enum';
import { ContextProvider } from '../providers';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService<AllConfig>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const headerLanguage = this.configService.getOrThrow('app.headerLanguage', {
      infer: true,
    });
    const fallbackLanguage = this.configService.getOrThrow(
      'app.fallbackLanguage',
      {
        infer: true,
      },
    );

    const lang = request.headers[headerLanguage] || fallbackLanguage;

    if (LanguageEnum[lang]) {
      ContextProvider.setLanguage(lang);
    }

    return next.handle();
  }
}

export const UseLanguageInterceptor = () => {
  return UseInterceptors(LanguageInterceptor);
};

export const AcceptLang = () => {
  return applyDecorators(
    ApiHeader({
      name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      description: 'Language code (e.g., en, vi, fr)',
      required: false,
    }),
  );
};
