import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  get KafkaConfig() {
    return {
      clientId: this.get('MICRO_SERVICE_CLIENT_ID'),
      borkers: [this.get('KAFKA_HOST')],
      groupdId: this.get('KAFKA_GROUP_ID'),
    };
  }
}
