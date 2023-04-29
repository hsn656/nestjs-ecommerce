import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorBody, errorMessages } from './custom';

@Catch()
export class ErrorsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    Logger.error(exception.message);
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    if (exception instanceof HttpException) {
      const message = exception.message;
      const httpStatus =
        exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      const errorMessage = (exception.getResponse() as HttpException).message;
      const errorCode = (exception.getResponse() as ErrorBody).code || '60400';
      const errors = Array.isArray(errorMessage)
        ? errorMessage
        : [errorMessage];
      const responseBody = {
        isSuccess: false,
        message,
        errorCode,
        data: null,
        errors,
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    } else {
      const responseBody = {
        isSuccess: false,
        message: errorMessages.global.internalError.message,
        errorCode: errorMessages.global.internalError.code,
        data: null,
        errors: [errorMessages.global.internalError.message],
      };

      httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
