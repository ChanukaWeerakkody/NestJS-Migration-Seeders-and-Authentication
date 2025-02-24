import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/exception.filter';
import { CustomLogger } from './logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(app.get(CustomLogger));
  app.enableCors();
  await app.listen(4000);

}
bootstrap();
