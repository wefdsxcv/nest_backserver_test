# NestJS DDD Practice Project

## 概要

このプロジェクトは、NestJSを用いてバックエンド開発の実践経験を積むための学習用プロジェクトです。

単純なCRUD実装だけではなく、

* DDD（Domain Driven Design）寄りのアーキテクチャ
* DIP（依存性逆転の原則）
* DI（Dependency Injection）
* DTO + Zod によるバリデーション
* Mockを利用した単体テスト
* GitHub Flow
* GitHub Actions による CI
* Docker 化
* AWS / Render へのデプロイ

を一通り体験することを目的としています。

---

# このプロジェクトを作った理由

実務では単にAPIを作るだけでなく、

* 保守しやすいアーキテクチャ設計
* テストしやすい設計
* CI/CD
* クラウド環境へのデプロイ

が求められます。

そのため、本プロジェクトでは機能開発そのものよりも、

「実務でよく使われる開発手法を体験する」

ことを主な目的としています。

---

# 使用技術

## Runtime

* Node.js

## Framework

* NestJS v11 (11.1.19)

## Language

* TypeScript

## Validation

* Zod
* nestjs-zod

## Testing

* Jest

## Container

* Docker
* Docker Compose

## CI/CD

* GitHub Actions

## Cloud

* AWS（学習予定）
* Render（デプロイ検証用）

---

# アーキテクチャ

DDD（Domain Driven Design）を参考にしたレイヤードアーキテクチャを採用しています。

```text
src/
├── main.ts
├── app.module.ts
│
├── modules/
│   └── message/
│
│       ├── presentation/
│       │   ├── message.controller.ts
│       │   └── dto/
│
│       ├── application/
│       │   └── message.service.ts
│
│       ├── domain/
│       │   ├── entities/
│       │   ├── value-objects/
│       │   ├── domain-services/
│       │   └── repository-interface/
│
│       ├── infrastructure/
│       │   └── config/
│
│       └── message.module.ts
│
├── common/
│   ├── infra/
│   ├── utils/
│   └── middleware/
│
└── config/
```

---

# 設計方針

## DIP（依存性逆転の原則）

ServiceはRepositoryの具体実装に依存せず、抽象に依存します。

```text
Service
 ↓
Repository Interface
 ↑
Repository Implementation
```

これにより、

* DB実装の差し替え
* Mock利用
* テスト容易性向上

を実現しています。

---

# 現在実装済み機能

## Message API

フロントエンドから送信されたテキストを受け取り、保存した結果を返却します。

フロントからのリクエスト形式想定～
{
  "text": "こんにちは！"
}
これ以外の形式はzod によって、はじかれる。
const CreateMessageSchema = z.object({
  text: z.string().min(1).max(100),
});


処理フロー

```text
Client
 ↓
POST /message
 ↓
Controller
 ↓
DTO
 ↓
Zod Validation
 ↓
Service
 ↓
Repository
 ↓
Response
```

レスポンス例

```json
{
  "message": "hello"
}
```

---

# バリデーション

TypeScriptの型チェックだけでは実行時の検証ができません。

そのため、

* DTO
* Zod

を組み合わせて実行時バリデーションを実施しています。

---

# テスト

## Unit Test

Jestを利用しています。

RepositoryはMockへ差し替えています。

```text
MessageService
        ↓
MockRepository
```

実際のDBには接続せず、Service単体を検証できます。

実行

```bash
npm run test
```

---

# GitHub Flow

以下の運用を練習しています。

```text
main
 ↑
PR
 ↑
feature/*
```

例

```bash
git checkout -b feature/text_uketori_hozon_api
```

開発

↓

Push

↓

Pull Request

↓

Review

↓

Merge

---

# CI

GitHub Actions を利用しています。

Push時に自動で

* Build
* Test
* Lint

を実行します。

設定ファイル

```text
.github/workflows/ci.yml
```

---

# CD
render にデプロイ。（aws はクレジットカード登録したくないので一旦render）
ciテスト通過時に、render にデプロイされるように、
dockerfile を記載。

---

# Docker

Dockerを利用して実行環境をコンテナ化しています。

今後AWSやRenderへのデプロイで利用予定です。

```bash
docker compose up
```

---

# 今後の予定

* Mockを利用した単体テストの追加
* Integration Test
* Redisによるレート制限
* ログ出力ミドルウェア
* Docker環境整備
* AWSデプロイ
* Renderデプロイ
* CD構築
* DNS設定体験
* ECS/Fargateの学習

---

# 学習目標

このプロジェクトのゴールは完成したサービスを作ることではなく、

* NestJS
* DDD
* DIP / DI
* Unit Test
* CI/CD
* Docker
* AWS

を実際に手を動かしながら学ぶことです。

そのため、機能追加よりもアーキテクチャや開発プロセスの理解を重視しています。
