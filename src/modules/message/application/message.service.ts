// message.service.ts
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../presentation/dto/message_dto';
import { IMessageRepository } from '../domain/repository-interface/message_repository_interface';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: IMessageRepository,
  ) {}

  async create(dto: CreateMessageDto) {
    const savedMessage = await this.messageRepository.save(dto.text);
    return savedMessage;
  }

  // 🔥 ★【Step 4】N+1問題を意図的に引き起こす最悪のメソッドを追加！
  //async getUsersWithLatestMessageNPlusOne() {
  //  console.log('🚨 N+1問題の検証用APIが呼び出されました。ループ処理を開始します...');

    // 本来は UserRepository から取得しますが、今回は実験のため 1〜100 までのユーザーIDの配列を擬似的に作ります
   // const userIds = Array.from({ length: 100 }, (_, i) => i + 1); // [1, 2, 3, ..., 100]

    // 🔴 恐怖のループ処理（ユーザーごとに毎回DBへクエリを投げつける）
   // const results = await Promise.all(
    //  userIds.map(async (userId) => {
     //   // ループの中で毎回非同期のクエリを発行（N回走る）
      //  const latestMessage = await this.messageRepository.findLatestByUserId(userId);
        
      //  return {
      //    userId,
      //    latestMessage: latestMessage || null,
     //   };
     // }),
    //);

  //  return results;
  //}

  
  async getUsersWithLatestMessageNPlusOne() {
    console.log('✨ [対策版] N+1問題を解決したクエリを実行します。');

    // 1. 調べたいユーザーIDのリスト（1〜100）を用意する
    const userIds = Array.from({ length: 100 }, (_, i) => i + 1);

    // 2. 🔴 ループを完全に廃止し、1回のクエリでDBから全員分のメッセージをドカンと取ってくる！
    const allMessages = await this.messageRepository.findLatestByUserIds(userIds);

    // 3. 取得した全データから、各ユーザーの最新の1件だけをメモリ上（JavaScript）でマッピングする
    const results = userIds.map((userId) => {
      // すでに手元にある全データ（allMessages）の中から、このユーザーのものを探す（DBアクセスは0回！）
      const userMessages = allMessages.filter((m) => m.userId === userId);
    
      return {
        userId,
        latestMessage: userMessages[0] || null, // orderBy: 'desc' で取得しているので[0]番目が最新
      };
    });

    return results;
  }
 
}