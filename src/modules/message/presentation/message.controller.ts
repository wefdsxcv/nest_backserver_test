import { Body, Controller, Post } from '@nestjs/common';

import { MessageService } from '../application/message.service';

import { CreateMessageDto } from './dto/message_dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() dto: CreateMessageDto) {
    const result = await this.messageService.create(dto);

    return {
      message: '保存成功',
      data: result,
    };
  }
}
