const request = require('supertest');
const express = require('express');
const { pool } = require('../config/db'); // DB接続プールをインポート

// テスト対象のルーターをインポート
const authRoutes = require('./auth');

// テスト用のExpressアプリをセットアップ
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);


// テストの実行前に毎回usersテーブルを空にする
beforeEach(async () => {
  await pool.query('DELETE FROM users');
});

// 全てのテストが終わったらDB接続を閉じる
afterAll(() => {
  pool.end();
});


describe('Auth Routes - /api/auth', () => {

  it('POST /register - should create a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser_jest',
        password: 'password123'
      });

    // レスポンスのステータスコードが201である（作成成功）ことを期待
    expect(response.statusCode).toBe(201);
    // レスポンスのメッセージが正しいことを期待
    expect(response.body.message).toBe('ユーザー登録が完了しました。');
  });

});