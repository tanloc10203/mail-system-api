import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

/**
 * Validate an object against a class-validator class.
 *
 * @param config The object to be validated.
 * @param envVariablesClass The class-validator class to validate against.
 * @returns The validated object.
 * @throws {Error} If the object is invalid.
 */
const validateConfig = <T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
) => {
  const validateConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  
  const errors = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validateConfig;
};

export default validateConfig;
