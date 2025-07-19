const ShindanRecord = require('../models/ShindanRecord.js');

// 新しい診断記録を保存する処理
exports.saveShindanRecord = async (req, res) => {
  try {
    const shindanData = req.body;
    const newRecord = await ShindanRecord.save(shindanData);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error });
  }
};