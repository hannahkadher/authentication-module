import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, Logger, UnprocessableEntityException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ValidationError } from 'class-validator';
import type { Response } from 'express';
import _ from 'lodash';

@Catch(UnprocessableEntityException)
export class HttpExceptionFilter
  implements ExceptionFilter<UnprocessableEntityException>
{
  private logger = new Logger(HttpExceptionFilter.name);

  constructor(public reflector: Reflector) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const responseBody = exception.getResponse() as {
      message: ValidationError[];
    };

    const validationErrors = this.processValidationErrors(responseBody.message);

    this.logger.error(
      `Unprocessable Entity Exception: ${JSON.stringify(validationErrors)} with status code ${statusCode}`,
      exception.stack,
    );

    responseBody.message = validationErrors;
    response.status(statusCode).json(responseBody);
  }

  private processValidationErrors(validationErrors: ValidationError[]): any[] {
    return validationErrors.map((error) => ({
      property: error.property,
      errors: _.mapValues(
        error.constraints,
        (msg, key) => `error.fields.${_.snakeCase(key)}`,
      ),
    }));
  }
}
