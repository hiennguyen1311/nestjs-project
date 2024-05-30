import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { connectMicroservice } from './microservices/microservices.index';
import { Kafka } from 'kafkajs';

import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );
  await connectMicroservice(app, Transport.KAFKA);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT);

  Logger.log(`Server running on ${await app.getUrl()}}`);

  return app;
}
bootstrap();
