"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const prisma_config_1 = require("../prisma.config");
// 1. PostgreSQLのコネクションプールを作成
const pool = new pg_1.Pool({ connectionString: prisma_config_1.default.datasource?.url });
// 2. Prisma 7用のドライバーアダプターにプールを渡す
const adapter = new adapter_pg_1.PrismaPg(pool);
// 3. クライアントのコンストラクタに adapter を渡して初期化（これがPrisma 7の正解です！）
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 5万件のダミーデータを生成中...');
    const totalRecords = 50000;
    const dummyMessages = [];
    const baseDate = new Date();
    for (let i = 1; i <= totalRecords; i++) {
        // 1〜500までのユーザーIDをランダムに割り振る（インデックスの検証用）
        const randomUserId = Math.floor(Math.random() * 500) + 1;
        // 日時も少しずつズラして生成する（ORDER BY の検証用）
        const dummyDate = new Date(baseDate.getTime() - i * 1000);
        dummyMessages.push({
            text: `これはテストメッセージ番号 ${i} です。`,
            userId: randomUserId,
            createdAt: dummyDate,
        });
    }
    console.log('💾 データベースへ一括挿入（バルクインサート）を開始します...');
    // ★重要: Prismaの createMany を使うことで、5万件を1回のSQLで高速挿入します
    await prisma.message.createMany({
        data: dummyMessages,
    });
    console.log('✨ 5万件のダミーデータの挿入が完了しました！');
}
main()
    .catch((e) => {
    console.error('❌ シードの実行に失敗しました:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
