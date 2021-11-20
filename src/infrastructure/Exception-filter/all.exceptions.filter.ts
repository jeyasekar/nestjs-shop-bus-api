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
    let message: string
    console.log('status from catch block http++--', JSON.stringify(exception))
    const msg = JSON.parse(JSON.stringify(exception))?.details
    //console.log('status from catch block response++', response)
    if (exception instanceof HttpException) {
      console.log('status from catch block http++', exception)
      console.log('status from catch block http++getResponse', exception.getResponse())
      console.log('status from catch block  http++message', exception.message)
      message = exception.message
      //err.errorMsg = exception.getResponse;
      //console.log('status from catch block http++', err)
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
      message: msg === undefined ? message : msg
    });
  }
}