const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const togoRoutes = require('./togo');
const authRoutes = require('./auth');

const app = express();
app.use(express.json());
app.use('/api/togo', togoRoutes);
app.use('/api/auth', authRoutes);

const testUser = { username: 'test_user_togo', password: 'password123' };
const testPatient = { patient_id: 'P_TOGO_01' };

beforeAll(async () => {
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [testUser.username, hashedPassword]);
  
  // 事前に各テーブルにデータを1件ずつ入れておく
  await pool.query("INSERT INTO karte_records (patient_id, record_data) VALUES ($1, '{}')", [testPatient.patient_id]);
  await pool.query("INSERT INTO lab_results (patient_id, test_date, results) VALUES ($1, CURRENT_DATE, '{}')", [testPatient.patient_id]);
  await pool.query("INSERT INTO shindan_records (patient_id, record_data) VALUES ($1, '{}')", [testPatient.patient_id]);
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
  await pool.query('DELETE FROM karte_records WHERE patient_id = $1', [testPatient.patient_id]);
  await pool.query('DELETE FROM lab_results WHERE patient_id = $1', [testPatient.patient_id]);
  await pool.query('DELETE FROM shindan_records WHERE patient_id = $1', [testPatient.patient_id]);
//   pool.end();
});

describe('Togo Routes - /api/togo', () => {
  let token;

  it('should login to get a token', async () => {
    const res = await request(app).post('/api/auth/login').send(testUser);
    token = res.body.token;
    expect(token).toBeDefined();
  });

  it('GET /:patientId - should get the integrated record', async () => {
    const res = await request(app)
      .get(`/api/togo/${testPatient.patient_id}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.karteRecords).toBeDefined();
    expect(res.body.labResults).toBeDefined();
    expect(res.body.shindanRecords).toBeDefined();
    expect(res.body.karteRecords.length).toBeGreaterThan(0);
  });
});