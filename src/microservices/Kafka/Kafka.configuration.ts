import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from '../../app.module';
import { Kafka, } from 'kafkajs';

export const KafkaAppWrapper = async () =>
  await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_HOST],
      },
    },
  });

// kafka broker running on localhost:9092 default port
const kafkaBroker = process.env.KAFKA_HOST;

// kafka topic used for queue messages
export const kafkaTopic = process.env.KAFKA_TOPIC;

// kafka client with basic config
export const KafkaClient = new Kafka({
  brokers: [kafkaBroker],
});
