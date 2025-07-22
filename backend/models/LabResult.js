// データベース接続設定をインポート
const db = require('../config/db.js');

class LabResult {
  // 新しい採血結果をデータベースに保存
  static async save(patientId, testDate, results) {
    try {
      // resultsオブジェクトはJSONB型としてそのまま保存できる
      const sql = 'INSERT INTO lab_results (patient_id, test_date, results) VALUES ($1, $2, $3) RETURNING *';
      const result = await db.query(sql, [patientId, testDate, results]);
      return result.rows[0];
    } catch (error) {
      console.error('Error saving lab result:', error);
      throw error;
    }
  }

  // 患者IDで採血結果をデータベースから検索（検査日の降順で並び替え）
  static async findByPatientId(patientId) {
    try {
      const sql = 'SELECT * FROM lab_results WHERE patient_id = $1 ORDER BY test_date DESC';
      const result = await db.query(sql, [patientId]);
      return result.rows; // 見つかった全レコードを配列で返す
    } catch (error) {
      console.error('Error finding lab results by patient id:', error);
      throw error;
    }
  }
}

module.exports = LabResult;