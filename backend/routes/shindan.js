const express = require('express');
const router = express.Router();
const shindanController = require('../controllers/shindanController.js');

// 新しい診断記録を保存
// POST /api/shindan
router.post('/', shindanController.saveShindanRecord);

// GET /api/shindan/:patientId - 特定患者の最新記録を取得
router.get('/:patientId', shindanController.getLatestShindanRecord);


module.exports = router;