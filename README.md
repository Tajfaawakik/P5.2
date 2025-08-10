はい、承知いたしました。
これまでの全ての開発内容を反映した、最新版のREADME.mdを作成します。

救急初診支援統合アプリ (Emergency Initial Care Support App)

概要 📝

このアプリケーションは、救急外来における初期診療の業務を円滑化し、診療の質と効率を向上させることを目的としたWebアプリケーションです。
医師、研修医、看護師などの医療従事者チームを対象とし、患者情報の構造化、診断プロセスの支援、検査結果の管理、そしてそれらの統合記録を提供します。

主な機能 ✨

本システムは、当初の要件定義書に基づいた機能に加え、開発過程で追加された多くの実用的な機能を備えています。

    認証機能: ログイン・ログアウト機能を備え、保護されたAPIルートにより、許可されたユーザーのみが患者データにアクセスできます。

    患者選択機能: アプリケーション全体で患者情報を共有し、ヘッダーから対象患者を動的に切り替え可能です。新しい患者の登録もここから行えます。

    カルテ記載支援 (App1): 患者の問診情報を効率的に入力・保存します。患者を選択すると、前回の入力内容が自動で復元されます。内服薬は、候補ボタンのクリックで直感的に追加・削除できます。

    症候鑑別支援 (App2): 症候から鑑別疾患を提示し、診断プロセスを記録・保存します。この機能も患者選択と連動し、前回の記録が復元されます。

    採血結果入力 (App3): 採血検査の結果を記録・管理し、経時変化を追跡できます。前回値の引用や矢印キーによる高度な入力支援機能を持ちます。

    統合記録 (App4): 選択された患者について、各機能で保存された内容を一つのテキストエリアにまとめて表示・コピーできます。

システム構成と技術スタック 🛠️

    アーキテクチャ: サーバークライアント型

    フロントエンド: React (Vite)

        状態管理: React Context API

        API通信: Axios

        ルーティング: React Router

        トークン解析: jwt-decode

    バックエンド: Node.js (Express)

        データベース: PostgreSQL

        認証: JWT (jsonwebtoken), bcryptjs

        環境変数管理: dotenv

    テスト:

        テストフレームワーク: Jest

        APIテスト: Supertest

セットアップ手順 🚀

このアプリケーションをローカル環境で実行するための手順です。

1. 前提条件

    Node.js: v20.x 以降を推奨

    PostgreSQL: ローカル環境で起動していること

    Git

2. プロジェクトのクローン

Bash

git clone <リポジトリのURL>
cd <プロジェクトのフォルダ>

3. データベースのセットアップ

まず、psqlなどのツールでPostgreSQLにスーパーユーザー（例: postgres）として接続し、以下のSQLコマンドを実行します。
SQL

-- 1. データベースを作成
CREATE DATABASE emergency_app;
CREATE DATABASE emergency_app_test; -- テスト用DB

-- 2. 専用ユーザーを作成 (パスワードは安全なものに変更してください)
CREATE USER app_user WITH PASSWORD 'mypassword';

-- 3. ユーザーに両方のDBへの全権限を付与
GRANT ALL PRIVILEGES ON DATABASE emergency_app TO app_user;
GRANT ALL PRIVILEGES ON DATABASE emergency_app_test TO app_user;

次に、作成したユーザーでそれぞれのデータベースに接続し、テーブルを作成します。
(まずemergency_appに接続して以下のSQLを実行し、次にemergency_app_testに接続して再度同じSQLを実行します)
Bash

# 開発用DBに接続
psql -h localhost -U app_user -d emergency_app

接続後、以下のSQLを実行してテーブルを作成してください。
SQL

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INT,
  sex VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE karte_records (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(50) NOT NULL,
  record_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lab_results (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(50) NOT NULL,
  test_date DATE NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shindan_records (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(50) NOT NULL,
  record_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- スキーマへの権限付与
GRANT USAGE, CREATE ON SCHEMA public TO app_user;

4. バックエンドのセットアップ

a. .envファイルの作成
backendフォルダの直下に.envという名前のファイルを作成し、以下の内容を記述します。

ファイル: backend/.env

DB_USER=app_user
DB_HOST=localhost
DB_DATABASE=emergency_app
DB_PASSWORD=mypassword
DB_PORT=5432
JWT_SECRET=your_super_secret_key_for_jwt

b. インストールと起動
Bash

# 1. バックエンドのディレクトリに移動
cd backend

# 2. 必要なライブラリをインストール
npm install

# 3. 開発サーバーを起動
npm run dev

    サーバーが http://localhost:3001 で起動します。

5. フロントエンドのセットアップ

新しいターミナルを開いて作業します。
Bash

# 1. フロントエンドのディレクトリに移動
cd frontend

# 2. 必要なライブラリをインストール
npm install

# 3. 開発サーバーを起動
npm run dev

    アプリケーションが http://localhost:5173 (または別のポート) で起動し、自動的にブラウザで開きます。

実行方法 🖥️

開発モード

上記の手順でバックエンドとフロントエンドの両方のサーバーを起動すると、アプリケーションにアクセスできます。
最初は/loginページにリダイレクトされます。curlまたはAPIクライアントで/api/auth/registerを使い、テストユーザーを登録してからログインしてください。

テストの実行

バックエンドのAPIテストを実行するには、backendディレクトリで以下のコマンドを実行します。
Bash

npm test


