import { Module } from '@nestjs/common';

import { MessageController } from './presentation/message.controller';

import { MessageService } from './application/message.service';

import { MessageRepository } from './infrastructure/message.repository';

@Module({
  controllers: [
    MessageController,
  ],

  providers: [
    MessageService,
    MessageRepository,
  ],
})
export class MessageModule {}