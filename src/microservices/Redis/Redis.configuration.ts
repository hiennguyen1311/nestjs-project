import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from 'src/app.module';

export const RedisAppWrapper = async () =>
  await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });
