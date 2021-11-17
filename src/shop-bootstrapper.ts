import { NestFactory } from '@nestjs/core';
import { ConfigService } from './infrastructure/configuration/config.service';
import { ShopModule } from './routes/shop.module';

async function bootstrap() {
  const app = await NestFactory.create(ShopModule)
  var port = ConfigService.create().getPort();
  console.log('port',port);
  app.enableCors();
  await app.listen(port)

}
bootstrap();
