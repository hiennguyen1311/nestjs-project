import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('MESSAGE_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    this.authClient.emit('create_user', JSON.stringify(createUserDto));
  }
}
