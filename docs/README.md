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

## 7. 多言語実装の仕様

今回のサンプルでは、以下の順で言語を解決するようにしています。

1. URL のパスに `/ja` または `/en` がある場合は、その値を優先する
2. その次に `?lang=ja` や `?lang=en` のクエリを参照する
3. どちらもない場合は `localStorage` に保存された値を使う
4. それでも未設定なら `ja` を既定値とする

また、言語切り替え時は URL も自動的に `/ja` や `/en` 形式に合わせて更新し、`localStorage` にも保存します。

---

## 8. 今後の課題整理と対応方針

### 8-1. API から文字列を受け取る場合の課題

API から返る文字列は、フロントエンド側でそのまま表示するだけでは多言語化しづらいです。特に、以下の点が課題になります。

- API が日本語・英語のどちらの文言を返すか、クライアント側で把握しづらい
- 文字列が固定文言か、ユーザー入力かで扱いが異なる
- 画面ごとに文言の粒度が異なり、翻訳キーの設計が難しい

#### 対応方針

- API は「翻訳キー」と「変数」を返す構造にする
- 例: `{ code: "home.title", params: { name: "Alice" } }`
- フロントエンド側はそのコードを i18n で解釈して表示する
- 文字列そのものを API で返す場合は、レスポンスに `locale` を含める

### 8-2. DB に多言語情報を保存する場合の課題

DB へ多言語情報を保存する場合、単純に `name` などのカラムを増やすだけだと拡張しづらいです。特に、以下が課題になります。

- 1つのレコードに複数言語の文言を持たせるか
- 文章の更新履歴を追いやすいか
- 検索や一覧表示でどの言語を基準にするか

#### 対応方針

- 主要な表示項目は `translations` のような JSON テーブルまたは子テーブルに分ける
- 例: `products` と `product_translations` を分離する
- 各翻訳に `language_code` と `content` を持たせる
- 既定言語と別言語を切り替える際は、フォールバックルールを明確にする

### 8-3. 推奨アーキテクチャ

- フロントエンド: URL / query / localStorage / default の優先順位で言語を決定
- API: 翻訳キーとパラメータを返す、または `locale` を付与して返す
- DB: `language_code` を持つ翻訳テーブルで管理する
- 運用: 新しい言語追加時は翻訳キーの設計を固定し、未翻訳時は fallback を使う

---

## 9. 注意点

- 今回はログイン情報を厳密に管理しないモック実装です。
- 実運用では認証・認可と JSON 設定ファイルの管理を別設計にする必要があります。
- 多言語化は「表示テキスト」だけでなく、データ取得・保存・検索の設計も含めて検討する必要があります。
