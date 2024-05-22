import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { formatErrorsHelper } from './utils';
import { AllExceptionsFilter, HttpExceptionFilter } from './utils/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('User authenticator service')
    .setDescription('Service for creation of users and validating user login')
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      enableDebugMessages: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(formatErrorsHelper(errors));
      },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(reflector),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useLogger(app.get(Logger));

  await app.listen(3000);
}
bootstrap();
