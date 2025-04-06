import { hasKeyWithType } from '@/utils/object';
import { ErrorResponse } from '@/utils/types';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { StatusCodeEnum } from '../enum';
import { EnvironmentService, TranslationService } from '../services';

@Catch()
export class CatchHttpError implements ExceptionFilter {
  private readonly logger = new Logger(CatchHttpError.name);

  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly translationService: TranslationService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const isDev = this.environmentService.isDevelopment;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseException: Record<string, unknown> | null = null;
    let details: Record<string, string> | null = null;
    let errorCode: number = StatusCodeEnum.InternalServerError;
    let message: string = 'Internal server error';
    let stack: string | undefined = undefined;

    if (exception instanceof HttpException) {
      const request = ctx.getRequest();
      const { fallbackLanguage, headerLanguage } = this.environmentService;
      const lang = request.headers[headerLanguage] || fallbackLanguage;

      const httpException = this.handleHttpException(exception, lang);

      status = exception.getStatus();
      responseException = httpException.responseException;
      details = httpException.details;
      errorCode = httpException.errorCode;
      message = httpException.message;
      stack = exception.stack;
    } else {
      if (exception instanceof Error) {
        message = exception.message;
        stack = exception.stack as string;
      }
    }

    const responseJson: ErrorResponse = {
      statusCode: status,
      errorCode,
      message,
      details,
      stack: isDev ? stack : null,
    };

    this.logger.error(message);
    this.logger.error('Catch http error', responseException);

    response.status(status).json(responseJson);
  }

  private handleHttpException(exception: HttpException, lang: string) {
    const responseException = exception.getResponse() as Record<string, unknown>;
    const message = this.translateErrorMessage(exception.message, lang);

    let errorCode: number = StatusCodeEnum.InternalServerError;
    let details: Record<string, string> | null = null;

    if (hasKeyWithType<Record<string, string>>(responseException, 'details', 'object')) {
      details = this.translateErrorDetails(responseException.details, lang);
    }

    if (
      hasKeyWithType<number | undefined>(responseException, 'errorCode', 'number') &&
      responseException.errorCode
    ) {
      errorCode = responseException.errorCode;
    }

    return {
      responseException,
      details,
      errorCode,
      message,
    };
  }

  private translateErrorMessage(message: string, lang: string): string {
    return this.translationService.translateError(message, lang);
  }

  private translateErrorDetails(details: Record<string, string>, lang: string): Record<string, string> {
    const translatedDetails: Record<string, string> = {};

    Object.entries(details).forEach(([key, value]) => {
      const translatedValue = this.translationService.translateError(value, lang);
      translatedDetails[key] = translatedValue;
    });

    return translatedDetails;
  }
}
