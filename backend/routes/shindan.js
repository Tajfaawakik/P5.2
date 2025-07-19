const express = require('express');
const router = express.Router();
const shindanController = require('../controllers/shindanController.js');

// 新しい診断記録を保存
// POST /api/shindan
router.post('/', shindanController.saveShindanRecord);

module.exports = router;