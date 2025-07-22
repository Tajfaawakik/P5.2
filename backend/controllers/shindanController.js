const ShindanRecord = require('../models/ShindanRecord.js');

// 新しい診断記録を保存する処理
exports.saveShindanRecord = async (req, res) => {
  try {
    const { patientId, recordData } = req.body; // <<<--- 分割代入で受け取る
    const newRecord = await ShindanRecord.save(patientId, recordData); // <<<--- 引数として渡す
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error });
  }
};