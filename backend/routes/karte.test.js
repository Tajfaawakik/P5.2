const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const karteRoutes = require('./karte');
const authRoutes = require('./auth');

const app = express();
app.use(express.json());
app.use('/api/karte', karteRoutes);
app.use('/api/auth', authRoutes);

const testUser = { username: 'test_user_karte', password: 'password123' };
const testPatient = { patient_id: 'P_KARTE_01', name: 'テスト患者カルテ' };

beforeAll(async () => {
  // usersテーブルのクリーンアップとテストユーザー作成
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [testUser.username, hashedPassword]);

  // patientsテーブルのクリーンアップとテスト患者作成
  await pool.query('DELETE FROM patients WHERE patient_id = $1', [testPatient.patient_id]);
  await pool.query('INSERT INTO patients (patient_id, name) VALUES ($1, $2)', [testPatient.patient_id, testPatient.name]);
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
  await pool.query('DELETE FROM patients WHERE patient_id = $1', [testPatient.patient_id]);
//   pool.end();
});

describe('Karte Routes - /api/karte', () => {
  let token;

  it('should login to get a token', async () => {
    const res = await request(app).post('/api/auth/login').send(testUser);
    token = res.body.token;
    expect(token).toBeDefined();
  });

  it('POST / - should save a karte record', async () => {
    const res = await request(app)
      .post('/api/karte')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patientId: testPatient.patient_id,
        recordData: { patientInfo: { name: 'テスト' } }
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.record_data.patientInfo.name).toBe('テスト');
  });

  it('GET /:patientId - should get the latest karte record', async () => {
    const res = await request(app)
      .get(`/api/karte/${testPatient.patient_id}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.patient_id).toBe(testPatient.patient_id);
  });
});