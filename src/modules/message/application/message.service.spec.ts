// message.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { IMessageRepository } from '../domain/repository-interface/message_repository_interface';
import { CreateMessageDto } from '../presentation/dto/message_dto';

describe('MessageService (単体テスト)', () => {
  let service: MessageService;
  let mockMessageRepository: jest.Mocked<IMessageRepository>;

  beforeEach(async () => {
    // 1. Jestでsaveメソッドを持つ偽物のオブジェクト（Mock）を作る
    const mockRepositoryFactory = () => ({
      save: jest.fn(),
    });

    // 2. テスト用のDIコンテナを作成する
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          // Serviceが求めている「IMessageRepository」に対して
          provide: IMessageRepository,
          // 本物のクラスではなく、上で作った偽物（Mock）をセットする
          useFactory: mockRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    // テストケース内で挙動を操作できるように、注入されたMockのインスタンスを取得しておく
    mockMessageRepository = module.get(IMessageRepository);
  });

  it('メッセージが正常に保存され、その結果が返ってくること', async () => {
    // 準備: 「リポジトリのsave()が呼ばれたら、この値を返す」という設定をする（Mock化）
    const mockDbResult = { id: 100, text: 'テスト用のメッセージ' };
    mockMessageRepository.save.mockResolvedValue(mockDbResult);

    // 実行: テスト対象のサービスにデータを渡して実行
    const dto: CreateMessageDto = { text: 'テスト用のメッセージ' };
    const result = await service.create(dto);

    // 検証: 返ってきた値が、Mockで設定した値と一致するか
    expect(result).toEqual(mockDbResult);

    // 検証: リポジトリのsaveメソッドが、正しい引数で、1回だけ呼ばれたか
    expect(mockMessageRepository.save).toHaveBeenCalledWith('テスト用のメッセージ');
    expect(mockMessageRepository.save).toHaveBeenCalledTimes(1);
  });
});