import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IMessageRepository } from '../domain/repository-interface/message_repository_interface';

@Injectable()
export class MessageRepository implements IMessageRepository {
  private prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  async save(text: string): Promise<{ id: number; text: string }> {
    console.log('📬 [DB操作] messagesテーブルへメッセージを保存します:', text);

    const saved = await this.prisma.message.create({
      data: {
        text,
        userId: 1,
      },
    });

    return {
      id: saved.id,
      text: saved.text,
    };
  }

  async findLatestByUserId(userId: number): Promise<any> {
    console.log(`🔍 [DB操作] user_id = ${userId} の最新メッセージを検索中...`);
    return await this.prisma.message.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findLatestByUserIds(userIds: number[]): Promise<any[]> {
    const userIdStr = userIds.slice(0, 5).join(', ');
    console.log(
      `🚀 [DB操作・対策版] user_id が [${userIdStr}...] に含まれる行を『1回のクエリ』で一括取得します！`,
    );

    return await this.prisma.message.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
