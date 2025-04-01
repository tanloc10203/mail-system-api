import { AllConfig } from '@/configs/config.type';
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
import { ConfigService } from '@nestjs/config';
import { StatusCodeEnum } from '../enum';

@Catch()
export class CatchHttpError implements ExceptionFilter {
  private readonly logger = new Logger(CatchHttpError.name);

  constructor(private readonly configService: ConfigService<AllConfig>) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let responseException: Record<string, unknown> | null = null;
    let details: Record<string, string> | null = null;
    let errorCode: number = StatusCodeEnum.InternalServerError;
    let message: string = 'Internal server error';
    const isDev =
      this.configService.getOrThrow('app.nodeEnv', {
        infer: true,
      }) === 'development';
    let stack: string | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      responseException = exception.getResponse() as Record<string, unknown>;
      stack = exception.stack as string;
      message = exception.message;

      if (hasKeyWithType<Record<string, string>>(responseException, 'details', 'object')) {
        details = responseException.details;
      }

      if (
        hasKeyWithType<number | undefined>(responseException, 'errorCode', 'number') &&
        responseException.errorCode
      ) {
        errorCode = responseException.errorCode;
      }
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
}
