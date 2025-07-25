const KarteRecord = require('../models/KarteRecord.js');

// 新しいカルテ記録を保存する処理
exports.saveKarteRecord = async (req, res) => {
  try {
    // フロントエンドから送信される全ての情報を受け取る
    const { patientId, recordData } = req.body; // <<<--- 分割代入で受け取る
    const newRecord = await KarteRecord.save(patientId, recordData); // <<<--- 引数として渡す
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error });
  }
};

// 患者IDで最新のカルテ記録を1件取得
exports.getLatestKarteRecord = async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await KarteRecord.findByPatientId(patientId);
    // findByPatientIdは新しい順で返ってくるので、最初のレコードを返す
    if (records && records.length > 0) {
      res.json(records[0]);
    } else {
      res.status(404).json({ message: '記録が見つかりません' });
    }
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error });
  }
};