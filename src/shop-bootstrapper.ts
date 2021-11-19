import { NestFactory } from '@nestjs/core';
import { ConfigService } from './infrastructure/configuration/config.service';
import { AllExceptionsFilter } from './infrastructure/Exception-filter/all.exceptions.filter';
import { HttpExceptionFilter } from './infrastructure/Exception-filter/http.exception.filter';
import { ShopModule } from './routes/shop.module';

async function bootstrap() {
  const app = await NestFactory.create(ShopModule)
  var port = ConfigService.create().getPort();
  console.log('port',port);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(port)

}
bootstrap();
