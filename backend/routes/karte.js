const express = require('express');
const router = express.Router();
const karteController = require('../controllers/karteController.js');
const auth = require('../middleware/auth.js'); // <<<--- ミドルウェアをインポート

// 新しいカルテ記録を保存
// POST /api/karte
router.post('/', auth, karteController.saveKarteRecord);

// GET /api/karte/:patientId - 特定患者の最新記録を取得
router.get('/:patientId',auth, karteController.getLatestKarteRecord);

module.exports = router;