import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class ErrorsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const message = exception.message;
    const httpStatus =
      exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage = (exception.getResponse() as HttpException).message;
    const errors = Array.isArray(errorMessage) ? errorMessage : [errorMessage];
    const responseBody = {
      isSuccess: false,
      message,
      data: null,
      errors,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
