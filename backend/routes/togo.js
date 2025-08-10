const express = require('express');
const router = express.Router();
const togoController = require('../controllers/togoController.js');
const auth = require('../middleware/auth.js'); // <<<--- ミドルウェアをインポート

// 特定の患者の統合記録を取得
// GET /api/togo/:patientId
router.get('/:patientId', auth, togoController.getTogoRecord);

module.exports = router;