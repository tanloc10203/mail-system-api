import { AllConfig } from '@/configs/config.type';
import { normalizeArgsDto } from '@/utils/transformers/normalize-args-dto.transformer';
import { ErrorResponse } from '@/utils/types';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  UnprocessableEntityException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { translateLang } from '../constants';
import { StatusCodeEnum } from '../enum';

@Catch(UnprocessableEntityException)
export class CatchValidationError
  implements ExceptionFilter<UnprocessableEntityException>
{
  private readonly logger = new Logger(CatchValidationError.name);

  constructor(
    private readonly configService: ConfigService<AllConfig>,
    private readonly i18n: I18nService,
  ) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const i18n = this.i18n;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const responseException = exception.getResponse() as Record<
      string,
      string[]
    >;

    const lang =
      request.headers[
        this.configService.getOrThrow('app.headerLanguage', { infer: true })
      ] ||
      this.configService.getOrThrow('app.fallbackLanguage', { infer: true });

    const body = request.body;

    const isDev =
      this.configService.getOrThrow('app.nodeEnv', {
        infer: true,
      }) === 'development';

    // parser error message
    const parserError: Record<string, string> = {};

    Object.keys(responseException).forEach(async (key) => {
      const { args, key: keyName } = normalizeArgsDto(
        responseException[key][0],
      );

      const propertyName = i18n.t(`key.${key}`, { lang });

      const value = i18n.t(keyName, {
        args: {
          property: propertyName,
          value: body?.[key] ?? '',
          ...args,
        },
      }) as string;

      // console.log(`${key}`, {
      //   property: propertyName,
      //   ...args,
      // });

      parserError[key] = value;
    });

    const responseJson: ErrorResponse = {
      statusCode: status,
      errorCode: StatusCodeEnum.ValidateFailed,
      message: i18n.t(translateLang.system.VALIDATION_FAILED, { lang }),
      details: parserError,
      stack: isDev ? exception.stack : null,
    };

    this.logger.error('CatchValidationError', parserError);

    response.status(status).json(responseJson);
  }
}
