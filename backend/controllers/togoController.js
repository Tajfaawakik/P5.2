const KarteRecord = require('../models/KarteRecord.js');
const ShindanRecord = require('../models/ShindanRecord.js');
const LabResult = require('../models/LabResult.js');

exports.getTogoRecord = async (req, res) => {
  try {
    const { patientId } = req.params;

    // 各モデルからデータを並行して取得
    const [karteRecords, shindanRecords, labResults] = await Promise.all([
      KarteRecord.findByPatientId(patientId),
      ShindanRecord.findByPatientId(patientId),
      LabResult.findByPatientId(patientId),
    ]);

    // 取得した全データを一つのオブジェクトにまとめて返す
    res.json({
      karteRecords,
      shindanRecords,
      labResults,
    });
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error });
  }
};