import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let details: string[] | undefined;
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const responseMessage =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: unknown }).message;

      if (Array.isArray(responseMessage)) {
        details = responseMessage.filter(
          (item): item is string => typeof item === 'string',
        );
        message = 'Validation failed';
      } else if (typeof responseMessage === 'string') {
        message = responseMessage;
      } else {
        message = exception.message;
      }
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      code: this.getErrorCode(status),
      message,
      timestamp: new Date().toISOString(),
      path: request.path,
      ...(details?.length ? { details } : {}),
    });
  }

  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
      [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
    };

    return codes[status] ?? (status >= 500 ? 'INTERNAL_ERROR' : 'HTTP_ERROR');
  }
}
