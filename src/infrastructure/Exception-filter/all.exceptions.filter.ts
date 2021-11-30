import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
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
    //console.log('+++++++++++++++++++___', exception)
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let mesage = msg
    let errCode: string
    if (exception instanceof Error) {
      let excep: any = exception
      console.log('+++++++++++++++++++____Error_', excep?.response?.data)
      status = excep?.response?.data?.statusCode
      mesage = excep?.response?.data?.message === undefined ? exception?.message : excep?.response?.data?.message
      errCode = excep?.response?.data?.errorCode
    }

    if (exception instanceof HttpException) {
      console.log('+++++++++++++++++++_____', exception.getResponse())
      let responseMsg: any = exception.getResponse()
      status = exception.getStatus()
      mesage = exception?.message
      errCode = responseMsg?.code

    }
    if (exception instanceof RpcException) {
      mesage = exception.message
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: mesage,
      errorCode: errCode
    });
  }
}