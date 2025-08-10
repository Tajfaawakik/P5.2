const request = require('supertest');
const express = require('express');
const { pool } = require('../config/db');

const authRoutes = require('./auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// テスト用のユーザー名
const testUsername = 'testuser_jest';

// 各テストの実行前に、テスト用ユーザーが存在すれば削除する
beforeEach(async () => {
  await pool.query('DELETE FROM users WHERE username = $1', [testUsername]);
});

afterAll(() => {
//   pool.end();
});


describe('Auth Routes - /api/auth', () => {

  it('POST /register - should create a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: testUsername,
        password: 'password123'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('ユーザー登録が完了しました。');
  });

});