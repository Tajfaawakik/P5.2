const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController.js');
const auth = require('../middleware/auth.js'); // <<<--- ミドルウェアをインポート

// 特定の患者の採血結果を全て取得
// GET /api/labs/:patientId
router.get('/:patientId', auth, labController.getResultsByPatient);

// 新しい採血結果を保存
// POST /api/labs
router.post('/', auth, labController.saveResult);

module.exports = router;