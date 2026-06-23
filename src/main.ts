import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express'; // ★追加: 型定義をインポート

async function bootstrap() {
  // ★型を NestExpressApplication に指定して作成
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ★追加: 外部（またはローカル）から渡されるIPアドレスを正しく信頼する設定
  app.set('trust proxy', true);

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(3000);
}
// main.ts の一番下をこう書き換える
bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
  process.exit(1);
});
