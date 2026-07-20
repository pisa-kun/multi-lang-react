# React × AWS CDK で作る多言語サンプルアプリを App Runner へデプロイしてみた

## 1. はじめに

こんにちは、Tom-panasonic さん。
今回は、React で作った多言語サンプルアプリを AWS CDK で App Runner にデプロイする手順をまとめました。

本記事では、以下の要件を実現しています。

- React で動作する多言語対応アプリ
- `ja` / `us` を切り替え可能
- ログイン前は画面上の `ja` / `us` ボタンで切り替え
- ログイン後はユーザー設定から言語を読み込み
- ログインはモック。JSON ファイルでユーザー設定を管理
- AWS CDK で App Runner を構築

## 2. 今回の要件

### 要件のポイント

- ログイン画面、ホーム画面、プロフィール画面の 3 画面を実装
- ログイン前は URL やボタンで言語切り替え
- ログイン後はサーバー側のユーザー設定に従う
- 設定変更は JSON ファイル書き込みで管理

### 使った技術

- React 18
- Vite + TypeScript
- react-i18next
- Express（モック API）
- Docker
- AWS CDK v2
- App Runner

## 3. プロジェクト構成

```
multi-lang-sample/
  ├ src/
  ├ server/
  ├ Dockerfile
  ├ cdk/
  ├ docs/
  ├ package.json
  └ tsconfig.json
```

- `src/`: React アプリ本体
- `server/`: モック API サーバー
- `Dockerfile`: コンテナ化定義
- `cdk/`: AWS CDK で App Runner を構築
- `docs/`: 本記事や手順の整理

## 4. ローカル開発の流れ

### セットアップ

```bash
cd c:\Develop\nodejs\multi-lang-sample
npm install
```

### ローカルで動かす

```bash
npm run dev
```

フロントエンドは `http://localhost:5173`、バックエンドは `http://localhost:4000` です。

## 5. Docker イメージの作成

### Dockerfile のポイント

- `builder` ステージで React アプリをビルド
- `runtime` ステージで `node server/index.js` を実行

App Runner では、サーバーとクライアントを同じコンテナ内に入れて動かす構成にしています。

### ビルド

```bash
docker build -t multi-lang-sample-app:latest .
```

## 6. ECR への push

### ECR へログイン

```bash
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com
```

### タグ付け

```bash
docker tag multi-lang-sample-app:latest <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lang-sample-app:latest
```

### Push

```bash
docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lang-sample-app:latest
```

## 7. AWS CDK で App Runner デプロイ

### CDK の準備

```bash
cd cdk
npm install
npx tsc
```

### デプロイ

```bash
npx cdk deploy --require-approval never
```

この手順で、App Runner サービスと必要な IAM ロールが作成されます。

## 8. 更新手順

アプリを変更したら、次の流れで更新します。

```bash
npm run build

docker build -t multi-lang-sample-app:latest .

docker tag multi-lang-sample-app:latest <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lang-sample-app:latest

docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lang-sample-app:latest
```

App Runner は `latest` タグの更新を検知して自動デプロイします。

## 9. まとめ

今回の構成では、React の多言語 UX を保ちながら、AWS CDK で App Runner にデプロイできる形を整えました。

- ログイン前とログイン後の言語切り替えを分離
- JSON ベースの設定保存でインフラを簡略化
- ECR + App Runner で継続的にデプロイ可能な構成

次は、認証や設定管理を本格対応するフェーズへ進めると良いですね。
