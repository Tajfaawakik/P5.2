const express = require('express');
const router = express.Router();
const karteController = require('../controllers/karteController.js');

// 新しいカルテ記録を保存
// POST /api/karte
router.post('/', karteController.saveKarteRecord);

// GET /api/karte/:patientId - 特定患者の最新記録を取得
router.get('/:patientId', karteController.getLatestKarteRecord);

module.exports = router;