//export class create_message_dto {
//  readonly text: string;  //上書き禁止、読みだけ。文字型
//}
//ts はあくまでコンパイル時にはじくだけ。本番時にはじくためにzod（バリデーション） を入れる。

// src/dto/message.dto.ts
import { createZodDto } from 'nestjs-zod'; //package.json（nodomodulesに実体が入っている）からimport
import { z } from 'zod';

// 1. Zodのスキーマを定義（ここで実行時のルールを決める）
const CreateMessageSchema = z.object({
  //z.object   オブジェクト内のプロパティの制約（受け取れる形）をつけれる。
  text: z.string().min(1).max(100), //text プロパティ
});

// 2. スキーマからDTOクラスを作成（これで型も手に入る）
export class CreateMessageDto extends createZodDto(CreateMessageSchema) {}

//↑親クラスのスキーマ（設計図）を継承。createZodDto は内部でクラスを生成して返す関数。nestjs-zodライブライが用意。
//（例）クラスを返す関数。
//function createZodDto(schema) {
//  return class {
//    static schema = schema;
//  };
//}
//実際に使う
//createZodDto(CreateMessageSchema)
//内部では、、
//class {
//  static schema = CreateMessageSchema;
//}
//class 子クラス  extend 親クラス  親クラス側はクラスを返す関数でもok
