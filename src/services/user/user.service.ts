import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ProducerService } from '../../microservices/queue/queue.producer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private producerService: ProducerService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);
    const emailData = {
      email: user.email,
      subject: 'Welcome to Our Community',
      html: `<p>Hello ${user.username},</p>
        <p>Welcome to our community! Your account is now active.</p>
        <p>Enjoy your time with us!</p>`,
    };
    await this.producerService.addToEmailQueue(emailData);
    return user;
  }
}
