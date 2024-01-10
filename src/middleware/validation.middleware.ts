import { isEmpty, validate, ValidationError } from "class-validator";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { HttpError } from "./error.middleware";
export const validateObject = async <T extends object>(
  type: ClassConstructor<T>,
  value: T,
  skipMissingProperties = true,
  allowEmpty = true,
): Promise<T> => {
  if (isEmpty(value)) {
    if (!allowEmpty) {
      throw new HttpError("Empty request");
    }
    return value;
  }
  const errors: ValidationError[] = await validate(plainToInstance(type, value), {
    skipMissingProperties,
  });

  if (errors.length > 0) {
    throw new HttpError("Invalid request", 400, errors);
  }

  return value;
};
