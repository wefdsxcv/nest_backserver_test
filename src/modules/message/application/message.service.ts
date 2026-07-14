import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../presentation/dto/message_dto';
import { IMessageRepository } from '../domain/repository-interface/message_repository_interface';

// メッセージデータの型を定義して any を排除
interface MessageData {
  id: number;
  text: string;
  userId: number;
  createdAt: Date;
}

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: IMessageRepository,
  ) {}

  async create(dto: CreateMessageDto) {
    const savedMessage = await this.messageRepository.save(dto.text);
    return savedMessage;
  }

  async getUsersWithLatestMessageNPlusOne() {
    console.log('✨ [対策版] N+1問題を解決したクエリを実行します。');

    // 1. 調べたいユーザーIDのリスト（1〜100）を用意する
    const userIds = Array.from({ length: 100 }, (_, i) => i + 1);

    // 2. 🔴 1回のクエリでDBから全員分のメッセージを一括取得（型を明示的にキャスト）
    const allMessages = await this.messageRepository.findLatestByUserIds(userIds) as MessageData[];

    // 3. 取得した全データから、各ユーザーの最新の1件だけをメモリ上でマッピングする
    const results = userIds.map((userId) => {
      // 型が定義されたので .userId へのアクセスが安全になります
      const userMessages = allMessages.filter((m) => m.userId === userId);

      return {
        userId,
        latestMessage: userMessages[0] || null,
      };
    });

    return results;
  }
}