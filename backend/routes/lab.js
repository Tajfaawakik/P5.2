const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController.js');

// 特定の患者の採血結果を全て取得
// GET /api/labs/:patientId
router.get('/:patientId', labController.getResultsByPatient);

// 新しい採血結果を保存
// POST /api/labs
router.post('/', labController.saveResult);

module.exports = router;