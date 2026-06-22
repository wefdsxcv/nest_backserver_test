import { Module } from '@nestjs/common';

import { MessageModule } from './modules/message/message.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [MessageModule, HealthModule],
})
export class AppModule {}
