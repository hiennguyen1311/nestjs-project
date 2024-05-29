import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule, UsersModule } from './services/services.index';
import { QueueModule } from './microservices/queue/queue.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    QueueModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mini-db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
