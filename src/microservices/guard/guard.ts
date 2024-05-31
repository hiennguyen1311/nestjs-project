import { UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

export class AuthGuard {}

export class Guard {
  @UseGuards(AuthGuard)
  @MessagePattern({ cmd: 'sum' })
  accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }
}
