import { Injectable } from '@nestjs/common';
import { IMessageRepository } from '../domain/repository-interface/message_repository_interface';

@Injectable()
export class MessageRepository implements IMessageRepository {
  save(text: string): Promise<{ id: number; text: string }> {
    console.log('DB保存:', text);
    return Promise.resolve({
      id: 1,
      text,
    });
  }
}
