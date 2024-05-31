import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { KafkaClient, kafkaTopic } from '../Kafka/Kafka.configuration';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const connection = amqp.connect(['amqp://localhost']);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('emailQueue', { durable: true });
      },
    });
  }

  async addToEmailQueue(mail: any) {
    try {
      await this.channelWrapper.sendToQueue(
        'emailQueue',
        Buffer.from(JSON.stringify(mail)),
        {
          persistent: true,
        },
      );
      Logger.log('Sent To Queue');
    } catch (error) {
      throw new HttpException(
        'Error adding mail to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  sendMessageToQueue(message: string) {
    sendMessageToQueue(message);
  }
}

export async function sendMessageToQueue(message: string) {
  const producer = KafkaClient.producer();
  await producer.connect();
  await producer.send({
    topic: kafkaTopic,
    messages: [
      {
        value: message, // Your message data goes here
      },
    ],
  });
  // Disconnect producer once message sending is done.
  await producer.disconnect();
}
