// データベース接続設定をインポート
const db = require('../config/db.js');

class ShindanRecord {
  // 診断記録をデータベースに保存
  static async save(patientId, shindanData) { // <<<--- 引数で受け取る
    try {
      const sql = 'INSERT INTO shindan_records (patient_id, record_data) VALUES ($1, $2) RETURNING *';
      const result = await db.query(sql, [patientId, shindanData]); // <<<--- 受け取った値を使用
      return result.rows[0];
    } catch (error) {
      console.error('Error saving shindan record:', error);
      throw error;
    }
  }

  // 患者IDで診断記録をデータベースから検索
  static async findByPatientId(patientId) {
    try {
      const sql = 'SELECT * FROM shindan_records WHERE patient_id = $1 ORDER BY created_at DESC';
      const result = await db.query(sql, [patientId]);
      return result.rows;
    } catch (error) {
      console.error('Error finding shindan records by patient id:', error);
      throw error;
    }
  }
}

module.exports = ShindanRecord;