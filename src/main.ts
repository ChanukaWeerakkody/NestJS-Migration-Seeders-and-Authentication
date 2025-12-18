import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/exception.filter';
import { CustomLogger } from './logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Custom Logger
  app.useLogger(app.get(CustomLogger));

  // Enable CORS
  app.enableCors();

  // Get port from ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
