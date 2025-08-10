const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const shindanRoutes = require('./shindan');
const authRoutes = require('./auth');

const app = express();
app.use(express.json());
app.use('/api/shindan', shindanRoutes);
app.use('/api/auth', authRoutes);

const testUser = { username: 'test_user_shindan', password: 'password123' };
const testPatient = { patient_id: 'P_SHINDAN_01' };

beforeAll(async () => {
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [testUser.username, hashedPassword]);
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
//   pool.end();
});

describe('Shindan Routes - /api/shindan', () => {
  let token;

  it('should login to get a token', async () => {
    const res = await request(app).post('/api/auth/login').send(testUser);
    token = res.body.token;
    expect(token).toBeDefined();
  });

  it('POST / - should save a shindan record', async () => {
    const res = await request(app)
      .post('/api/shindan')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patientId: testPatient.patient_id,
        recordData: { selectedSymptoms: ['発熱'] }
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.record_data.selectedSymptoms).toContain('発熱');
  });

  it('GET /:patientId - should get the latest shindan record', async () => {
    const res = await request(app)
      .get(`/api/shindan/${testPatient.patient_id}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.patient_id).toBe(testPatient.patient_id);
  });
});