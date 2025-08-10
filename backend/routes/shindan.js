const express = require('express');
const router = express.Router();
const shindanController = require('../controllers/shindanController.js');
const auth = require('../middleware/auth.js'); // <<<--- ミドルウェアをインポート

// 新しい診断記録を保存
// POST /api/shindan
router.post('/', auth, shindanController.saveShindanRecord);

// GET /api/shindan/:patientId - 特定患者の最新記録を取得
router.get('/:patientId', auth, shindanController.getLatestShindanRecord);


module.exports = router;