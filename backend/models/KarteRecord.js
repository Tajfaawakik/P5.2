// データベース接続設定をインポート
const db = require('../config/db.js');

class KarteRecord {
  // カルテ記録をデータベースに保存
  static async save(karteData) {
    try {
      // patientIdは将来的に動的にするが、今は固定値を入れる
      const patientId = '12345';
      const sql = 'INSERT INTO karte_records (patient_id, record_data) VALUES ($1, $2) RETURNING *';
      const result = await db.query(sql, [patientId, karteData]);
      return result.rows[0];
    } catch (error) {
      console.error('Error saving karte record:', error);
      throw error;
    }
  }

  // 患者IDでカルテ記録をデータベースから検索
  static async findByPatientId(patientId) {
    try {
      const sql = 'SELECT * FROM karte_records WHERE patient_id = $1 ORDER BY created_at DESC';
      const result = await db.query(sql, [patientId]);
      return result.rows;
    } catch (error) {
      console.error('Error finding karte records by patient id:', error);
      throw error;
    }
  }
}

module.exports = KarteRecord;