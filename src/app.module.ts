import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // ★ThrottlerGuardを追加
import { APP_GUARD } from '@nestjs/core'; // ★追加: グローバルガード用の定数
import { MessageModule } from './modules/message/message.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    MessageModule,
    HealthModule,
  ],
  // ★追加: アプリ全体（すべてのコントローラー）にこのガードを適用するプロの書き方
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
