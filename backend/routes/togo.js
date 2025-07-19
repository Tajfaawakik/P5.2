const express = require('express');
const router = express.Router();
const togoController = require('../controllers/togoController.js');

// 特定の患者の統合記録を取得
// GET /api/togo/:patientId
router.get('/:patientId', togoController.getTogoRecord);

module.exports = router;