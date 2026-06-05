import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3001); //port 3000解放
}

//const p = bootstrap    async bootstrap()なので、async で非同期、promise<void> を返す。なので、.catch(error)エラーキャッチするか。await を明記
//void で返り値は無しを明示。
void bootstrap();
