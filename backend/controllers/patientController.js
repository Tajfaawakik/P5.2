const Patient = require('../models/Patient.js');

// 全ての患者を取得
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error });
  }
};

// 新しい患者を作成
exports.createPatient = async (req, res) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error });
  }
};