import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let err: ExceptionMsg
    console.log('status from catch block http', exception)
    if (exception instanceof HttpException) {
      console.log('status from catch block http', err)
      err = JSON.parse(JSON.stringify(exception.getResponse));
      console.log('status from catch block http', exception)
    }
    if (exception instanceof RpcException) {
      err = JSON.parse(JSON.stringify(exception.getError()));
      console.log('status from catch block', err)
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: err?.errorMsg
    });
  }
}