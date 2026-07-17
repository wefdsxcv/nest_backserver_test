import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../presentation/dto/message_dto';
import { IMessageRepository } from '../domain/repository-interface/message_repository_interface';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async create(dto: CreateMessageDto) {
    const savedMessage = await this.messageRepository.save(dto.text);
    return savedMessage;
  }

  async getUsersWithLatestMessageNPlusOne() {
    console.log('✨ [対策版] N+1問題を解決したクエリを実行します。');

    const userIds = Array.from({ length: 100 }, (_, i) => i + 1);

    const allMessages = (await this.messageRepository.findLatestByUserIds(
      userIds,
    )) as {
      id: number;
      text: string;
      userId: number;
      createdAt: Date;
    }[];

    const results = userIds.map((userId) => {
      const userMessages = allMessages.filter((m) => m.userId === userId);

      return {
        userId,
        latestMessage: userMessages[0] || null,
      };
    });

    return results;
  }
}
