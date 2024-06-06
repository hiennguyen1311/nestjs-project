import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from '../Kafka/Kafka.producer';

@Injectable()
export class ProducerService extends KafkaProducerService {}
