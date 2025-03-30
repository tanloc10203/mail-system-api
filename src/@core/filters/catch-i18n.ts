import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ValidationError,
} from '@nestjs/common';
import iterate from 'iterare';
import {
  I18nContext,
  I18nValidationError,
  I18nValidationException,
  I18nValidationExceptionFilterDetailedErrorsOption,
  I18nValidationExceptionFilterErrorFormatterOption,
} from 'nestjs-i18n';
import {
  formatI18nErrors,
  mapChildrenToValidationErrors,
} from 'nestjs-i18n/dist/utils';

type I18nValidationExceptionFilterOptions =
  | I18nValidationExceptionFilterDetailedErrorsOption
  | I18nValidationExceptionFilterErrorFormatterOption;

@Catch(I18nValidationException)
export class CatchI18n implements ExceptionFilter {
  constructor(
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: true,
    },
  ) {}
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current();

    if (!i18n) return;

    const validationErrors = Object.entries(exception.getResponse()).map(
      ([property, constraints]) => ({
        property,
        constraints: constraints.reduce(
          (acc, constraint) => {
            acc[constraint] = constraint;
            return acc;
          },
          {} as Record<string, string>,
        ),
        children: [],
      }),
    );

    const errors = formatI18nErrors(validationErrors, i18n.service, {
      lang: i18n.lang,
    });

    console.log(`errors`, errors);

    const normalizedErrors = this.normalizeValidationErrors(errors);

    switch (host.getType() as string) {
      case 'http':
        const response = host.switchToHttp().getResponse();
        const responseBody = this.buildResponseBody(
          host,
          exception,
          normalizedErrors,
        );
        response
          .status(this.options.errorHttpStatusCode || exception.getStatus())
          .send(responseBody);
        break;
      case 'graphql':
        exception.errors = normalizedErrors as I18nValidationError[];
        return exception;
    }
  }

  private isWithErrorFormatter(
    options: I18nValidationExceptionFilterOptions,
  ): options is I18nValidationExceptionFilterErrorFormatterOption {
    return 'errorFormatter' in options;
  }

  protected normalizeValidationErrors(
    validationErrors: ValidationError[],
  ): string[] | I18nValidationError[] | object {
    if (
      this.isWithErrorFormatter(this.options) &&
      !('detailedErrors' in this.options)
    )
      return this.options.errorFormatter
        ? this.options.errorFormatter(validationErrors)
        : [];

    if (
      !this.isWithErrorFormatter(this.options) &&
      !this.options.detailedErrors
    )
      return this.flattenValidationErrors(validationErrors);

    return validationErrors;
  }

  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    return iterate(validationErrors)
      .map((error) => mapChildrenToValidationErrors(error))
      .flatten()
      .filter((item) => !!item.constraints)
      .map((item) => (item.constraints ? Object.values(item.constraints) : []))
      .flatten()
      .toArray();
  }
  protected buildResponseBody(
    host: ArgumentsHost,
    exc: I18nValidationException,
    error: string[] | I18nValidationError[] | object,
  ) {
    if ('responseBodyFormatter' in this.options) {
      return this.options.responseBodyFormatter
        ? this.options.responseBodyFormatter(host, exc, error)
        : {};
    } else {
      return {
        statusCode:
          this.options.errorHttpStatusCode === undefined
            ? exc.getStatus()
            : this.options.errorHttpStatusCode,
        message: error,
        error: exc.getResponse(),
      };
    }
  }
}
