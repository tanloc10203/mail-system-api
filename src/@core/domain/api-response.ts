import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface ICoreApiResponse<T> {
  metadata: T;
  message?: string;
  options?: Record<string, unknown>;
}

export function CoreApiResponse<T>(classRef: Type<T>) {
  abstract class AbstractCoreApiResponse<T> {
    @ApiProperty({ type: classRef, nullable: true })
    metadata: T | T[] | null;

    @ApiProperty({
      type: String,
      description: 'Successfully',
    })
    message?: string;

    @ApiProperty({
      type: Object,
    })
    options?: Record<string, unknown>;
  }

  Object.defineProperty(AbstractCoreApiResponse, 'name', {
    writable: false,
    value: `Api${classRef.name}Response`,
  });

  return AbstractCoreApiResponse;
}

export const apiResponse = <T>(payload: ICoreApiResponse<T>): ICoreApiResponse<T> => {
  return payload;
};
