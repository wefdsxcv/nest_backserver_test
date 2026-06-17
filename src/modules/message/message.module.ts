// message.module.ts
import { Module } from '@nestjs/common';
import { MessageController } from './presentation/message.controller';
import { MessageService } from './application/message.service';
import { IMessageRepository } from './domain/repository-interface/message_repository_interface';
import { MessageRepository } from './infrastructure/message.repository';

@Module({
  controllers: [MessageController],
  providers: [
    MessageService,
    {
      // トークンとしてインターフェース（抽象）を指定
      provide: IMessageRepository,
      // 本番環境で実際に使うクラス（具象）を指定
      useClass: MessageRepository,
    },
  ],
})
export class MessageModule {}
