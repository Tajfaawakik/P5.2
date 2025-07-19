const express = require('express');
const router = express.Router();
const karteController = require('../controllers/karteController.js');

// 新しいカルテ記録を保存
// POST /api/karte
router.post('/', karteController.saveKarteRecord);

module.exports = router;