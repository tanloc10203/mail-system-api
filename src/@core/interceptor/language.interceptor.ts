import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LanguageEnum } from '../enum';
import { ContextProvider } from '../providers';
import { EnvironmentService } from '../services';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  constructor(private readonly environmentService: EnvironmentService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { headerLanguage, fallbackLanguage } = this.environmentService;

    const lang = request.headers[headerLanguage] || fallbackLanguage;

    console.log(`Check language:::`, lang);

    if (LanguageEnum[lang]) {
      ContextProvider.setLanguage(lang);
    }

    return next.handle();
  }
}

export const UseLanguageInterceptor = () => {
  return UseInterceptors(LanguageInterceptor);
};
