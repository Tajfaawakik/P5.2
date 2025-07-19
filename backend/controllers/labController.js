const LabResult = require('../models/LabResult.js');

// 新しい採血結果を保存する処理
exports.saveResult = async (req, res) => {
  try {
    const { patientId, testDate, results } = req.body;
    const newResult = await LabResult.save(patientId, testDate, results);
    res.status(201).json(newResult);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error });
  }
};

// 患者IDで採血結果を取得する処理
exports.getResultsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const results = await LabResult.findByPatientId(patientId);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error });
  }
};