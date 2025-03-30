import { AllConfig } from '@/configs/config.type';
import { ErrorResponse } from '@/utils/types';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StatusCodeEnum } from '../enum';

@Catch(UnprocessableEntityException)
export class CatchValidationError
  implements ExceptionFilter<UnprocessableEntityException>
{
  private readonly logger = new Logger(CatchValidationError.name);

  constructor(private readonly configService: ConfigService<AllConfig>) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const responseException = exception.getResponse() as Record<
      string,
      string[]
    >;

    const isDev =
      this.configService.getOrThrow('app.nodeEnv', {
        infer: true,
      }) === 'development';

    // parser error message
    const parserError: Record<string, string> = {};

    Object.keys(responseException).forEach((key) => {
      parserError[key] = responseException[key][0];
    });

    const responseJson: ErrorResponse = {
      statusCode: status,
      errorCode: StatusCodeEnum.ValidateFailed,
      message: exception.message,
      details: parserError,
      stack: isDev ? exception.stack : null,
    };

    this.logger.error('CatchValidationError', responseException);

    response.status(status).json(responseJson);
  }
}
