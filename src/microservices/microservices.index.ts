import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function connectMicroservice<T = any>(
  app: INestApplication<T>,
  transport: number,
) {
  switch (transport) {
    case Transport.RMQ: {
      await app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`,
          ],
          queue: process.env.RABBITMQ_QUEUE_NAME,
          queueOptions: {
            durable: true,
          },
        },
      });
      break;
    }
    case Transport.KAFKA: {
      await app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_GROUP_ID,
            brokers: [process.env.KAFKA_HOST],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID,
          },
        },
      });
      break;
    }
    default: {
      break;
    }
  }
}
