const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController.js');

// GET /api/patients - 全ての患者を取得
router.get('/', patientController.getAllPatients);

// POST /api/patients - 新しい患者を作成
router.post('/', patientController.createPatient);

module.exports = router;