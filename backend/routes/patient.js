const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController.js');
const auth = require('../middleware/auth.js'); // <<<--- ミドルウェアをインポート

// GET /api/patients - 全ての患者を取得
router.get('/', auth, patientController.getAllPatients);

// POST /api/patients - 新しい患者を作成
router.post('/', auth, patientController.createPatient);

module.exports = router;