import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus'; // 1. インポートを追加
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule], // 2. ここに TerminusModule を追加！
  controllers: [HealthController],
})
export class HealthModule {}
