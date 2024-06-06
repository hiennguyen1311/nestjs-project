import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';
import {
  SUBSCRIBER_FIXED_FN_REF_MAP,
  SUBSCRIBER_FN_REF_MAP,
  SUBSCRIBER_OBJ_REF_MAP,
} from './queue.decorator';
import {  KafkaPayload } from './queue.message';
import { AppConfigService } from '../../services/config/config.service';

@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private fixedConsumer: Consumer;
  private readonly consumerSuffix = '-' + Math.floor(Math.random() * 100000);

  constructor(private config: AppConfigService) {
    this.kafka = new Kafka({
      clientId: this.config.KafkaConfig.clientId,
      brokers: this.config.KafkaConfig.borkers,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: this.config.KafkaConfig.groupId + this.consumerSuffix,
    });
    this.fixedConsumer = this.kafka.consumer({
      groupId: this.config.KafkaConfig.groupId,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    SUBSCRIBER_FN_REF_MAP.forEach((functionRef, topic) => {
      // attach the function with kafka topic name
      this.bindAllTopicToConsumer(functionRef, topic);
    });

    SUBSCRIBER_FIXED_FN_REF_MAP.forEach((functionRef, topic) => {
      // attach the function with kafka topic name
      this.bindAllTopicToFixedConsumer(functionRef, topic);
    });

    await this.fixedConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const functionRef = SUBSCRIBER_FIXED_FN_REF_MAP.get(topic);
        const object = SUBSCRIBER_OBJ_REF_MAP.get(topic);
        // bind the subscribed functions to topic
        await functionRef.apply(object, [message.value.toString()]);
      },
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const functionRef = SUBSCRIBER_FN_REF_MAP.get(topic);
        const object = SUBSCRIBER_OBJ_REF_MAP.get(topic);
        // bind the subscribed functions to topic
        await functionRef.apply(object, [message.value.toString()]);
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.fixedConsumer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    await this.fixedConsumer.disconnect();
  }

  async bindAllTopicToConsumer(callback, _topic) {
    await this.consumer.subscribe({ topic: _topic, fromBeginning: false });
  }

  async bindAllTopicToFixedConsumer(callback, _topic) {
    await this.fixedConsumer.subscribe({ topic: _topic, fromBeginning: false });
  }

  async sendMessage(kafkaTopic: string, kafkaMessage: KafkaPayload) {
    await this.producer.connect();
    const metadata = await this.producer
      .send({
        topic: kafkaTopic,
        messages: [{ value: JSON.stringify(kafkaMessage) }],
      })
      .catch(e => console.error(e.message, e));
    await this.producer.disconnect();
    return metadata;
  }
}