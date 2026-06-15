import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url } = request;
    // expressの初期型定義で any になっている body を、安全な unknown 型として明示的に受け取る
    const body = request.body as unknown;
    const startTime = Date.now();

    // 入り口のログ
    const requestLog: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      type: 'REQUEST',
      method: String(method),
      url: String(url),
      // body が真偽値・オブジェクトであり、かつ null でないことを安全にチェック
      body:
        body && typeof body === 'object'
          ? (body as Record<string, unknown>)
          : undefined,
    };
    console.log(JSON.stringify(requestLog));

    // 出口のログ
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;

        const responseLog: Record<string, unknown> = {
          timestamp: new Date().toISOString(),
          level: 'INFO',
          type: 'RESPONSE',
          method: String(method),
          url: String(url),
          statusCode: Number(statusCode),
          responseTimeMs: responseTime,
        };

        console.log(JSON.stringify(responseLog));
      }),
    );
  }
}
