# ==========================================
# 1. ビルド用ステージ (Build Stage)　
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係の定義ファイルをコピー
COPY package*.json ./

# 開発用ライブラリも含めてすべてインストール
RUN npm ci

# ソースコードをすべてコピー
COPY . .

# NestJSアプリをビルド（TypeScriptをJavaScriptにコンパイルしてdistフォルダを生成）
RUN npm run build

# 本番環境に不要な開発用ライブラリ（devDependencies）を削除し、本番用のみ残す
RUN npm prune --production


# ==========================================
# 2. 実行用ステージ (Production Stage)
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# セキュリティのため、rootユーザーではなくnodeユーザーで実行する
USER node

# ビルドステージから、実行に必要な最小限のファイルだけをコピー
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

# NestJSがデフォルトで起動するポート（3000）を開放
EXPOSE 3000

# アプリケーションを起動
CMD ["node", "dist/main"]