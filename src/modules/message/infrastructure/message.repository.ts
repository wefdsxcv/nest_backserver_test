import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // ★PrismaClientをインポート
import { IMessageRepository } from '../domain/repository-interface/message_repository_interface';

@Injectable()
export class MessageRepository implements IMessageRepository {
  // ★Prisma 6仕様のシンプルなインスタンス生成（自動で.envのDATABASE_URLを読み込みます）
  private prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  // 1. メッセージをデータベースに保存する（今回は仮でuserId: 1として保存）
  async save(text: string): Promise<{ id: number; text: string }> {
    console.log('📬 [DB操作] messagesテーブルへメッセージを保存します:', text);
    
    const saved = await this.prisma.message.create({
      data: {
        text,
        userId: 1, // 実験用に固定
      },
    });

    return {
      id: saved.id,
      text: saved.text,
    };
  }

  // 2. ★【今回の最重要追記】特定のユーザーIDの最新メッセージを1件だけ取得する
  async findLatestByUserId(userId: number): Promise<any> {
    // 🔴 ここで発行されるクエリが、Service層のループによって「100回連続」で走ることになります！
    console.log(`🔍 [DB操作] user_id = ${userId} の最新メッセージを検索中...`);

    return await this.prisma.message.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc', // 作成日時の新しい順（降順）
      },
    });
  }
  // ★メソッドを追加（N+１問題解消用のメソッド。GET /message/nplusoneでユースケースが呼び出すリポジトリ（domain 層のmessage_repository_interfaceは抽象クラス）はこれ。）
  async findLatestByUserIds(userIds: number[]): Promise<any[]> {
    console.log(`🚀 [DB操作・対策版] user_id が [${userIds.slice(0, 5)}...] に含まれる行を『1回のクエリ』で一括取得します！`);

    // SQLの「WHERE user_id IN (1, 2, 3, ...)」が発行されます
    return await this.prisma.message.findMany({
      where: {
        userId: {
          in: userIds, // 配列をそのまま渡す
        },
      },
      orderBy: {
        createdAt: 'desc', // 新しい順に並べる
      },
    });
  }
}