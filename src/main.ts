import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'; // 追加

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ★これを1行追加するだけで、すべてのAPIの入り口と出口に共通ログが差し込まれます！
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(3000); //port 3000解放
}

//const p = bootstrap    async bootstrap()なので、async で非同期、promise<void> を返す。なので、.catch(error)エラーキャッチするか。await を明記
//void で返り値は無しを明示。
void bootstrap();
