はい、承知いたしました。
これまでの全機能と、PostgreSQLデータベースの設定を含めた、最終版のREADME.mdを作成します。

救急初診支援統合アプリ (Emergency Initial Care Support App)

概要 📝

このアプリケーションは、救急外来における初期診療の業務を円滑化し、診療の質と効率を向上させることを目的としたWebアプリケーションです。
医師、研修医、看護師などの医療従事者チームを対象とし、患者情報の構造化、診断プロセスの支援、検査結果の管理、そしてそれらの統合記録を提供します。

主な機能 ✨

本システムは、以下の4つの主要な支援機能を統合しています。

    カルテ記載支援 (App1): 患者の問診情報を効率的に入力し、サーバーに保存します。患者を選択すると、前回の入力内容が自動で復元されます。

    症候鑑別支援 (App2): 症候から考えられる鑑別疾患を提示し、診断プロセスを記録・保存します。この機能も患者選択と連動します。

    採血結果入力 (App3): 採血検査の結果を記録・管理し、経時変化を追跡できます。前回値の引用や矢印キーによる高度な入力支援機能を持ちます。

    統合記録 (App4): 選択された患者について、各機能で保存された内容を一つのテキストエリアにまとめて表示・コピーできます。

    患者管理: アプリケーション全体で患者情報を共有し、ヘッダーから動的に対象患者を切り替えることができます。

システム構成と技術スタック 🛠️

    アーキテクチャ: サーバークライアント型

    フロントエンド: React (Vite)

        グローバルな状態管理: React Context API

        API通信: Axios

        ルーティング: React Router

    バックエンド: Node.js (Express)

        データベース: PostgreSQL

        認証（基礎）: JWT (jsonwebtoken), bcryptjs

    パッケージ管理: npm

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

-- 2. 専用ユーザーを作成 (パスワードは安全なものに変更してください)
CREATE USER app_user WITH PASSWORD 'mypassword';

-- 3. データベースへの全権限を付与
GRANT ALL PRIVILEGES ON DATABASE emergency_app TO app_user;

次に、作成したユーザーで今作成したデータベースに接続し直し、テーブルを作成します。
Bash

# app_userでemergency_appデータベースに接続
psql -h localhost -U app_user -d emergency_app

接続後、以下のSQLを流し込んでテーブルを作成してください。
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

-- 作成したユーザーにスキーマの使用権と作成権を付与
GRANT USAGE, CREATE ON SCHEMA public TO app_user;

4. バックエンドのセットアップ

Bash

# 1. バックエンドのディレクトリに移動
cd backend

# 2. .envファイルを作成
#    db.jsがこのファイルを参照してDBに接続します
#    以下の内容で`.env`という名前のファイルを作成してください

ファイル: backend/.env

DB_USER=app_user
DB_HOST=localhost
DB_DATABASE=emergency_app
DB_PASSWORD=mypassword
DB_PORT=5432
JWT_SECRET=your_super_secret_key_for_jwt

Bash

# 3. 必要なライブラリをインストール
npm install

# 4. 開発サーバーを起動
npm run dev

    サーバーが http://localhost:3001 で起動します。

5. フロントエンドのセットアップ

(バックエンドのターミナルは起動したまま) 新しいターミナルを開いて作業します。
Bash

# 1. フロントエンドのディレクトリに移動
cd frontend

# 2. 必要なライブラリをインストール
npm install

# 3. 開発サーバーを起動
npm run dev

    package.jsonにはNode.js v17以降で発生するエラーへの対策 (--openssl-legacy-provider) が設定済みです。
    アプリケーションが http://localhost:5173 (または別のポート) で起動し、自動的にブラウザで開きます。

