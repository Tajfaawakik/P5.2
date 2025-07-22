const db = require('../config/db.js');

class Patient {
  // 全ての患者を検索
  static async findAll() {
    try {
      const sql = 'SELECT * FROM patients ORDER BY created_at DESC';
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error('Error finding all patients:', error);
      throw error;
    }
  }

  // 新しい患者を作成
  static async create(patientData) {
    try {
      const { patient_id, name, age, sex } = patientData;
      const sql = 'INSERT INTO patients (patient_id, name, age, sex) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await db.query(sql, [patient_id, name, age, sex]);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }
}

module.exports = Patient;