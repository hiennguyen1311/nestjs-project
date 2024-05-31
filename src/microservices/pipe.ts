import { ValidationPipe, UsePipes } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

export class Pipe {
  @UsePipes(new ValidationPipe())
  @MessagePattern({ cmd: 'sum' })
  accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }
}
