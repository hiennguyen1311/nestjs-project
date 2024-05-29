import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './RabbitMQ.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'cats_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
