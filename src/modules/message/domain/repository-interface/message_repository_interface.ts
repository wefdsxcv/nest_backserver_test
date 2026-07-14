// message_repository_interface.ts
export abstract class IMessageRepository {
  abstract save(text: string): Promise<{ id: number; text: string }>;

  // ★追記：特定のユーザーIDの最新メッセージを1件だけ取得する定義
  abstract findLatestByUserId(userId: number): Promise<any>;
  // ★追加：複数ユーザーIDのメッセージを「1回のクエリ」で一括取得する約束
  abstract findLatestByUserIds(userIds: number[]): Promise<any[]>;
}
