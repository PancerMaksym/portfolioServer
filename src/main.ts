import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT;
  const hostname = '0.0.0.0'

  app.enableCors({
    origin: ['https://create-resume-wheat.vercel.app'],
    credentials: 'omit',
  });
  app.use(cookieParser());
  await app.listen(port, hostname);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
