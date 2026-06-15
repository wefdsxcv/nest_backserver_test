import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // NestJS標準のLogger。本番環境（Renderなど）ではこれをJSON出力に切り替える土台になります
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    
    const { method, url, body } = request;
    const startTime = Date.now();

    // 1. 入り口（リクエスト受信時）のログをJSON形式で出力
    const requestLog = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      type: 'REQUEST',
      method,
      url,
      // セキュリティのため、パスワード等の機密情報が含まれる場合はマスクする処理を実務では挟みます
      body: Object.keys(body).length ? body : undefined,
    };
    // ターミナル、およびRenderの（標準出力）へ流す
    console.log(JSON.stringify(requestLog));

    // 2. 出口（処理が完了してレスポンスを返す時）のログをキャッチ
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;

        const responseLog = {
          timestamp: new Date().toISOString(),
          level: 'INFO',
          type: 'RESPONSE',
          method,
          url,
          statusCode,
          responseTimeMs: responseTime,
        };
        
        console.log(JSON.stringify(responseLog));
      }),
    );
  }
}