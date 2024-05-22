import { BaseResponseDto } from './base.response.dto';

/**
 * DTO for successful API responses.
 * @typeparam Type - The type of the data payload.
 */

export class SuccessResponseDto<Type> implements BaseResponseDto {
  code: number;
  data: Type;
  message: string;

  constructor(input: BaseResponseDto) {
    if (input.code) this.code = input.code;
    else this.code = 200;

    if (input.data) this.data = input.data;

    this.message = input.message;
  }
}
