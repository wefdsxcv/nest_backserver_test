import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid'; // ★追加: UUIDを生成する関数をインポート

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();

    //request型にrequest_idプロパティを追加
    const request = ctx.getRequest<Request & { requestId?: string }>(); // ★型を拡張
    const response = ctx.getResponse<Response>();

    const { method, url } = request;
    const body = request.body as unknown;
    const startTime = Date.now();

    //★追加:リクエストに一意のIDを発行（すでにあれば使い回す||は左の値が真な左。偽なら右）
    const requestId = request.requestId || uuidv4();
    request.requestId = requestId; // リクエストオブジェクトに保存。httpリクエストのheaderにランダム生成した。request_idの値をrequestオブジェクトのrequestプロパティに代入。

    //リクエスト入口のログ
    const requestLog: Record<string, unknown> = {
      requestId: requestId, // ★追加
      timestamp: new Date().toISOString(),
      level: 'INFO',
      type: 'REQUEST',
      method: String(method),
      url: String(url),
      body:
        body && typeof body === 'object'
          ? (body as Record<string, unknown>)
          : undefined,
    };
    console.log(JSON.stringify(requestLog));

    //レスポンス出口のログ
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;

        const responseLog: Record<string, unknown> = {
          requestId: requestId, // ★追加
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
