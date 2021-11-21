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
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let err: ExceptionMsg
    console.log('status from catch block http++--', JSON.stringify(exception, getCircularReplacer()))
    const msg = JSON.parse(JSON.stringify(exception, getCircularReplacer()))?.details
    console.log('+++++++++++++++++++', msg)
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let mesage = msg
    if (exception instanceof HttpException) {
      status = exception.getStatus()
      mesage = exception.message

    }
    if (exception instanceof RpcException) {
      mesage = exception.message
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: mesage
    });
  }
}