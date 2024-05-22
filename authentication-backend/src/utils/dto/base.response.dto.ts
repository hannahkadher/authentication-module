import { WithOptional } from './optional.type';

/**
 * Base DTO for API responses.
 */

export class BaseResponseDto {
  code?: number;

  message: string;
  error?: string;
  data?: any;

  /**
   * Static method to create a response object.
   * @param options - Object containing response properties.
   * @returns BaseResponseDto instance.
   */
  static wrap({
    data,
    code = 200,
    message = 'Success',
    error = undefined,
  }: WithOptional<BaseResponseDto, 'message'>) {
    return { data, code, message, error };
  }
}
