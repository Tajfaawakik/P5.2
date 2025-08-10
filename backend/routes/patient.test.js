const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const patientRoutes = require('./patient');
const authRoutes = require('./auth');
// middlewareはルート定義に含まれているので、直接は不要

const app = express();
app.use(express.json());
app.use('/api/patients', patientRoutes);
app.use('/api/auth', authRoutes);

const testUser = {
  username: 'testuser_for_patients',
  password: 'password123',
};

beforeAll(async () => {
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [testUser.username, hashedPassword]);
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
//   pool.end();
});


describe('Patient Routes - /api/patients', () => {

  it('GET / - should fail without a token', async () => {
    const response = await request(app).get('/api/patients');
    expect(response.statusCode).toBe(401);
  });
  
  it('GET / - should fetch patients with a valid token', async () => {
    // Step 1: ログインしてトークンを取得
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    
    expect(loginResponse.statusCode).toBe(200);
    const token = loginResponse.body.token;

    // Step 2: 取得したトークンを使って保護されたAPIにアクセス
    const patientResponse = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${token}`);
      
    expect(patientResponse.statusCode).toBe(200);
    expect(patientResponse.body).toBeInstanceOf(Array);
  });
  
});