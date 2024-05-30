import { AppConfigService } from '../services/config/config.service';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

const providers = [AppConfigService];

@Global()
@Module({
  providers,
  imports: [HttpModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
