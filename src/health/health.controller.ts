import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    // ※もしすでにDB（Prisma等）を導入している場合は、ここに TypeOrmHealthIndicator や PrismaHealthIndicator を注入してDB接続チェックも可能です
  ) {}

  @Get()
  @HealthCheck()
  check() {
    // サーバーが正常に起動していれば status: "ok" を返す
    return this.health.check([]);
  }
}
