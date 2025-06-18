import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { GlobalExceptionFilter } from './http/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());

  const envService = app.get(EnvService);

  const port = envService.get<number>('PORT');

  await app.listen(port);
}
bootstrap();
