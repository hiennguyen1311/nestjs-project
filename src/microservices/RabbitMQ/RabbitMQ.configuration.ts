import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from 'src/app.module';

export const RabbitMQAppWrapper = async () => {
  const app = await NestFactory.create(AppModule);
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://admin:admin@localhost:5672`],
      queue: 'queue_subscriber',
      queueOptions: {
        durable: true,
      },
    },
  });

  return app;
};
