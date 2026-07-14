import { Body, Controller,Get, Post } from '@nestjs/common';

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
  // 🔥 ★【Step 4】N+1問題を大炎上させる実験用エンドポイントを追記！
  // URL「GET http://localhost:3000/messages/nplusone」で呼び出せます
  @Get('nplusone')
  async getNPlusOne() {
    // 司令塔であるServiceのN+1再現メソッドを呼び出す
    return await this.messageService.getUsersWithLatestMessageNPlusOne();
  }
}
