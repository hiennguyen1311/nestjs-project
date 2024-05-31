import { AppConfigService } from '../services/config/config.service';
// import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

const providers = [AppConfigService];

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers, ],
})
export class SharedModule {}
