import { AllConfig } from '@/configs/config.type';
import { hasKeyWithType } from '@/utils/object';
import { ErrorResponse } from '@/utils/types';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StatusCodeEnum } from '../enum';

@Catch(HttpException)
export class CatchHttpError implements ExceptionFilter<HttpException> {
  private readonly logger = new Logger(CatchHttpError.name);

  constructor(private readonly configService: ConfigService<AllConfig>) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const responseException = exception.getResponse();

    const isDev =
      this.configService.getOrThrow('app.nodeEnv', {
        infer: true,
      }) === 'development';

    let details: Record<string, string> | null = null;
    let errorCode: number = StatusCodeEnum.InternalServerError;
    let message: string = exception.message;

    if (
      hasKeyWithType<Record<string, string>>(
        responseException,
        'details',
        'object',
      )
    ) {
      details = responseException.details;
    }

    if (
      hasKeyWithType<number | undefined>(
        responseException,
        'errorCode',
        'number',
      ) &&
      responseException.errorCode
    ) {
      errorCode = responseException.errorCode;
    }

    const responseJson: ErrorResponse = {
      statusCode: status,
      errorCode,
      message,
      details,
      stack: isDev ? exception.stack : null,
    };

    this.logger.error('Catch http error', responseException);

    response.status(status).json(responseJson);
  }
}
