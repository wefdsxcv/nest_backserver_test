"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@prisma/config");
require("dotenv/config"); // ★これがないと .env から DATABASE_URL を読み込めません
exports.default = (0, config_1.defineConfig)({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DATABASE_URL, // ★ここで接続URLを指定するルールになりました
    },
});
