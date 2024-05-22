import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { omit } from 'lodash';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = exception.getStatus();

    const message = exception.getResponse() as {
      key: string;
      args: Record<string, unknown>;
    };

    this.logger.error(
      `An error has been encountered while processing application code. Please check the recent log for proper trace. Status code = ${statusCode}, message = ${JSON.stringify(
        message,
      )}`,
    );
    this.logger.debug(
      `Exception encountered in application code = ${exception.name}, Stack trace = ${exception.stack}`,
    );

    response.status(statusCode).send({ message: message, code: statusCode });
  }
}
