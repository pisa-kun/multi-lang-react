# multi-lang-sample デプロイドキュメント

このドキュメントでは、React + AWS CDK + App Runner を使った多言語サンプルアプリのデプロイ手順を整理します。

## 目的

- React アプリを多言語対応で実装
- ユーザーログイン前とログイン後で言語切り替えの挙動を分ける
- ログインはモック、設定は JSON ファイルで管理
- AWS CDK で App Runner にデプロイ

## 構成

- `src/`: React アプリ本体
- `server/`: モック API サーバー
- `Dockerfile`: コンテナイメージのビルド定義
- `cdk/`: AWS CDK アプリ
- `docs/`: Qiita 記事用のまとめ資料

---

## 1. ローカル環境の確認

### 必要なもの

- Node.js 20.x
- npm
- Docker
- AWS CLI
- AWS CDK
- Terraform は不要です

### コマンド例

```bash
node -v
npm -v
docker --version
aws --version
cdk --version
```

---

## 2. アプリのビルド

```bash
cd c:\Develop\nodejs\multi-lang-sample
npm install
npm run build
```

ビルドに成功すると `dist/` フォルダが生成されます。

---

## 3. Docker イメージの作成と ECR への push

### 3-1) ECR リポジトリの用意

今回の CDK スタックは ECR リポジトリを自動的に作成します。先に CDK をデプロイしてリポジトリを作るか、手動でリポジトリを用意してください。

#### A. CDK でリポジトリを先に作る場合

```bash
cd cdk
npm install
npx tsc
npx cdk deploy --require-approval never
```

この手順で ECR リポジトリと App Runner 用の IAM ロールが作成されます。

#### B. 手動でリポジトリを作る場合

```bash
aws ecr create-repository --repository-name multi-lang-sample-app --region ap-northeast-1
```

### 3-2) ECR ログイン

```bash
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com
```

### 3-3) Docker イメージのビルド

事前に `npm run build` を実行して `dist/` を生成しておきます。

```bash
npm run build
docker build -t multi-lang-sample-app:latest .
```

### 3-4) タグ付け

```bash
docker tag multi-lang-sample-app:latest <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lang-sample-app:latest
```

### 3-5) Push

```bash
docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lang-sample-app:latest
```

> App Runner は `latest` タグを参照する設定です。イメージを push すると自動的にデプロイ更新される想定です。

---

## 4. CDK で App Runner をデプロイ

### 1) CDK アプリの準備

```bash
cd cdk
npm install
npx tsc
```

### 2) デプロイ

```bash
npx cdk deploy --require-approval never
```

### 3) 出力されるもの

- App Runner サービス
- ECR アクセス用 IAM ロール
- App Runner 実行用 IAM ロール

---

## 5. App Runner の更新フロー

アプリコードを変更したあとは、次の手順で更新します。

```bash
npm run build

docker build -t multi-lang-sample-app:latest .

docker tag multi-lang-sample-app:latest <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lang-sample-app:latest

docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lang-sample-app:latest
```

App Runner は `latest` タグの更新を検知して自動デプロイします。

---

## 6. Qiita 記事の構成案

1. イントロ
2. 仕様と要件
3. プロジェクト構成
4. React 側の多言語設計
5. Docker と App Runner の連携
6. CDK でのインフラ構成
7. 実際のデプロイ手順
8. まとめ

---

## 7. 注意点

- 今回はログイン情報を厳密に管理しないモック実装です。
- 実運用では認証・認可と JSON 設定ファイルの管理を別設計にする必要があります。
