import { defineConfig } from '@prisma/config';
import 'dotenv/config'; // ★これがないと .env から DATABASE_URL を読み込めません

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL, // ★ここで接続URLを指定するルールになりました
  },
});