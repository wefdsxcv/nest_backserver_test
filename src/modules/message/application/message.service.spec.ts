import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { IMessageRepository } from '../domain/repository-interface/message_repository_interface';
import { CreateMessageDto } from '../presentation/dto/message_dto';

describe('MessageService (単体テスト)', () => {
  let service: MessageService;
  // 型定義を少し厳密にして、ESLintの警告を回避します
  let mockSaveFn: jest.Mock;

  beforeEach(async () => {
    // 1. 最初に関数単体としてMockを作る
    mockSaveFn = jest.fn();

    // 2. テスト用のDIコンテナを作成する
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: IMessageRepository,
          // オブジェクトのメソッドとして割り当てる
          useValue: {
            save: mockSaveFn,
          },
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('メッセージが正常に保存され、その結果が返ってくること', async () => {
    // 準備: Mock関数単体に対して戻り値を設定する
    const mockDbResult = { id: 100, text: 'テスト用のメッセージ' };
    mockSaveFn.mockResolvedValue(mockDbResult);

    // 実行
    const dto: CreateMessageDto = { text: 'テスト用のメッセージ' };
    const result = await service.create(dto);

    // 検証: 戻り値のチェック
    expect(result).toEqual(mockDbResult);

    // 検証: メソッドではなく、変数としてのMock関数を検証することで ESLint を黙らせます
    expect(mockSaveFn).toHaveBeenCalledWith('テスト用のメッセージ');
    expect(mockSaveFn).toHaveBeenCalledTimes(1);
  });
});
