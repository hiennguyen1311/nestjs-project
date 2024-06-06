import { Injectable } from '@nestjs/common';
import { KafkaConsumerService } from '../Kafka/Kafka.consumer';

@Injectable()
export class ConsumerService extends KafkaConsumerService {}