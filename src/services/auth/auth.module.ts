import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.MICRO_SERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.MICRO_SERVICE_CLIENT_ID,
            brokers: [process.env.KAFKA_HOST],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID,
          },
        },
      },
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
