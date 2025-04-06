import { normalizeArgsDto } from '@/utils/transformers/normalize-args-dto.transformer';
import { ErrorResponse } from '@/utils/types';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { translateLang } from '../constants';
import { StatusCodeEnum } from '../enum';
import { ContextProvider } from '../providers';
import { EnvironmentService } from '../services';
import { UseLanguageInterceptor } from '../interceptor';

@UseLanguageInterceptor()
@Catch(UnprocessableEntityException)
export class CatchValidationError implements ExceptionFilter<UnprocessableEntityException> {
  private readonly logger = new Logger(CatchValidationError.name);

  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly i18n: I18nService,
  ) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const i18n = this.i18n;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const responseException = exception.getResponse() as Record<string, string[]>;

    const { headerLanguage, fallbackLanguage, isDevelopment } = this.environmentService;

    const lang =
      request.headers[headerLanguage] || ContextProvider.getLanguage() || fallbackLanguage;

    const body = request.body;

    // parser error message
    const parserError: Record<string, string> = {};

    Object.keys(responseException).forEach(async (key) => {
      const { args, key: keyName } = normalizeArgsDto(responseException[key][0]);

      const propertyName = i18n.t(`key.${key}`, { lang });

      const value = i18n.t(keyName, {
        args: {
          property: propertyName,
          value: body?.[key] ?? '',
          ...args,
        },
      }) as string;

      parserError[key] = value;
    });

    const responseJson: ErrorResponse = {
      statusCode: status,
      errorCode: StatusCodeEnum.ValidateFailed,
      message: i18n.t(translateLang.system.VALIDATION_FAILED, { lang }),
      details: parserError,
      stack: isDevelopment ? exception.stack : null,
    };

    this.logger.error('CatchValidationError', parserError);

    response.status(status).json(responseJson);
  }
}
