import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService } from '@nestjs/terminus'; // 必要に応じてインポート元を確認してください

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      // 👇 ここに HealthCheckService のモックを追加します
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            // Controller内で呼び出しているメソッドがあればここにモック関数を定義します
            // 例: check: jest.fn().mockResolvedValue({ status: 'ok' })
            check: jest.fn(), //[undefined を返すだけの空っぽの関数」をjestが自動で身代わりとして作ってくれます。
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
