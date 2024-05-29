import { Module } from '@nestjs/common';
import { ConsumerService } from './queue.consumer';
import { ProducerService } from './queue.producer';
import { EmailService } from '@/services/services.index';

@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService],
})
export class QueueModule {}
