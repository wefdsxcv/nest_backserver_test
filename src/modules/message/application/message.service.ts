import { Injectable } from '@nestjs/common';

import { CreateMessageDto } from '../presentation/dto/message_dto';

import { MessageRepository } from '../infrastructure/message.repository';

@Injectable()
export class MessageService {

  constructor(
    private readonly messageRepository: MessageRepository,
  ) {}

  async create(dto: CreateMessageDto) {

    const savedMessage =
      await this.messageRepository.save(dto.text);

    return savedMessage;
  }
}