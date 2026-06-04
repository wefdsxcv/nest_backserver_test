// message.service.ts
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../presentation/dto/message_dto';
import { IMessageRepository } from '../domain/repository-interface/message_repository_interface'; // ← インターフェース（抽象クラス）をインポート

@Injectable()
export class MessageService {
  constructor(
    // 具象クラスではなく、抽象（Interface）をインジェクションする！
    private readonly messageRepository: IMessageRepository,
  ) {}

  async create(dto: CreateMessageDto) {
    const savedMessage = await this.messageRepository.save(dto.text);
    return savedMessage;
  }
}