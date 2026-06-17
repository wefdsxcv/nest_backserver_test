// message_repository_interface.ts
export abstract class IMessageRepository {
  abstract save(text: string): Promise<{ id: number; text: string }>;
}
