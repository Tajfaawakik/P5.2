const KarteRecord = require('../models/KarteRecord.js');

// 新しいカルテ記録を保存する処理
exports.saveKarteRecord = async (req, res) => {
  try {
    // フロントエンドから送信される全ての情報を受け取る
    const karteData = req.body;
    const newRecord = await KarteRecord.save(karteData);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error });
  }
};