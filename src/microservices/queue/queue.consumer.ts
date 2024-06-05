// import amqp, { ChannelWrapper } from 'amqp-connection-manager';
// import { ConfirmChannel } from 'amqplib';
// import { EmailService } from '../../services/email/email.service';
// @Injectable()
// export class ConsumerService implements OnModuleInit {
//   private channelWrapper: ChannelWrapper;
//   private readonly logger = new Logger(ConsumerService.name);
//   constructor(private emailService: EmailService) {
//     const connection = amqp.connect(['amqp://localhost']);
//     this.channelWrapper = connection.createChannel();
//   }

//   public async onModuleInit() {
//     try {
//       await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
//         await channel.assertQueue('emailQueue', { durable: true });
//         await channel.consume('emailQueue', async (message) => {
//           if (message) {
//             const content = JSON.parse(message.content.toString());
//             this.logger.log('Received message:', content);
//             await this.emailService.sendEmail(content);
//             channel.ack(message);
//           }
//         });
//       });
//       this.logger.log('Consumer service started and listening for messages.');
//     } catch (err) {
//       this.logger.error('Error starting the consumer:', err);
//     }
//   }
// }

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { KafkaClient } from '../Kafka/Kafka.configuration';
import { sendMessageToQueue } from './queue.producer';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private consumer;
  constructor() {
    this.consumer = KafkaClient.consumer({
      groupId: process.env.KAFKA_GROUP_ID,
    });
  }

  public async onModuleInit() {
    try {
      await this.consumer.connect();
      // Subscribing to out Kafka topic
      await this.consumer.subscribe({
        topic: process.env.KAFKA_TOPIC,
        fromBeginning: true,
      });
      await this.consumer.run({
        autoCommit: false, // It won't commit message acknowledge to kafka until we don't do manually
        eachMessage: async ({ partition, message }) => {
          const messageData = message.value.toString();
          try {
            // Do the business Logic
            Logger.log('Received Message', messageData);
          } catch (error) {
            Logger.error('Consumer Error', error);
            // Resending message to kafka queue for redelivery
            await sendMessageToQueue(messageData);
          } finally {
            const offset = +message.offset + 1;
            // Committing the message offset to Kafka
            await this.consumer.commitOffsets([
              {
                topic: process.env.KAFKA_TOPIC,
                partition,
                offset: offset.toString(),
              },
            ]);
          }
        },
      });
    } catch (error) {
      Logger.error('Consumer Error', error);
    }
  }
}
