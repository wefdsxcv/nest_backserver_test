import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageRepository {

  async save(text: string) {

    //ここでsql  orm prisma 等
    // 今回はDBの代わり
    console.log('DB保存:', text);

    return {
      id: 1,
      text,
    };
  }
}