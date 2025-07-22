const { Pool } = require('pg');

// データベースへの接続情報を設定
// 先ほど作成したユーザー名、パスワード、データベース名に合わせて変更してください
const pool = new Pool({
  user: 'app_user',
  host: 'localhost',
  database: 'emergency_app',
  password: 'password',
  port: 5432,
});

// 他のファイルからデータベース操作ができるように、クエリ関数をエクスポート
module.exports = {
  query: (text, params) => pool.query(text, params),
};