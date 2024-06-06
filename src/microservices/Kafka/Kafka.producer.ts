import { Injectable } from '@nestjs/common';
import { KafkaClient, kafkaTopic } from '../Kafka/Kafka.configuration';

@Injectable()
export class KafkaProducerService {
  public addToEmailQueue(emailData: any) {

  }
  
  public sendMessageToQueue(message: string) {
    sendMessageToQueue(message)
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
