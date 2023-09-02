import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { logger } from "../utils";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number, message: string;

    // if exception is an instance of HttpException use the status and the original error message
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = `${status}: ${JSON.stringify(exception.message)}`;
    } else {
      // For security reasons we don't expose the actual error message
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "Global error occurred!";
    }

    // Log the error message
    logger.error("Global error:", exception);

    // Send a custom response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
