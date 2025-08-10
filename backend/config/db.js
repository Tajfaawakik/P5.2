const { Pool } = require('pg');

// process.env.NODE_ENVが'test'かどうかで接続情報を切り替える
const isTest = process.env.NODE_ENV === 'test';

const connectionConfig = {
  user: process.env.DB_USER || 'app_user',
  host: process.env.DB_HOST || 'localhost',
  database: isTest ? 'emergency_app_test' : (process.env.DB_DATABASE || 'emergency_app'),
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
};

const pool = new Pool(connectionConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // テスト完了後に接続を切るためにエクスポート
};