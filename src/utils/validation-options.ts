import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

const generateErrors = (errors: ValidationError[]) => {
  return errors.reduce(
    (acc, error) => ({
      ...acc,
      [error.property]:
        (error.children?.length ?? 0) > 0
          ? generateErrors(error.children ?? [])
          : Object.values(error.constraints ?? {}),
    }),
    {},
  );
};

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory(errors) {
    return new UnprocessableEntityException(generateErrors(errors));
  },
};

export default validationOptions;
