import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchEverythingFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : 'status' in exception
          ? exception.status
          : 500;

    const errorCode = 'code' in exception ? exception.code : null;
    const detailsError = 'errors' in exception ? exception.errors : null;
    const stack = exception.stack;

    this.logger.error(exception.message, exception);

    const responseBody = {
      statusCode: httpStatusCode,
      message: exception.message,
      details: detailsError,
      errorCode,
      stack,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatusCode);
  }
}
