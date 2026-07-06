import { PrismaClient } from '@prisma/client';

// Prisma 6では、引数なしのこれで自動的に .env の DATABASE_URL を見に行ってくれます！
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 5万件のダミーデータを生成中...');

  const totalRecords = 50000;
  const dummyMessages: Array<{ text: string; userId: number; createdAt: Date }> = [];
  const baseDate = new Date();

  for (let i = 1; i <= totalRecords; i++) {
    const randomUserId = Math.floor(Math.random() * 500) + 1;
    const dummyDate = new Date(baseDate.getTime() - i * 1000);

    dummyMessages.push({
      text: `これはテストメッセージ番号 ${i} です。`,
      userId: randomUserId,
      createdAt: dummyDate,
    });
  }

  console.log('💾 データベースへ一括挿入（バルクインサート）を開始します...');
  
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