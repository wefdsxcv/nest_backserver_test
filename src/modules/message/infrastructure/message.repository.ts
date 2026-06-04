// message.repository.ts
import { Injectable } from '@nestjs/common';
import { IMessageRepository } from '../domain/repository-interface/message_repository_interface';

//具体的な実装（sql(orm)とかで　実際のdbを叩いて　データを取得する。今回はここで　id textを返却）
@Injectable()
export class MessageRepository implements IMessageRepository { // ← implements を追加
  async save(text: string) {
    console.log('DB保存:', text);
    return {
      id: 1,
      text,
    };
  }
}