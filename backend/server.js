const express = require('express');
const cors = require('cors');

// ルーターのインポート
const authRoutes = require('./routes/auth.js');
const labRoutes = require('./routes/lab.js'); 

const app = express();
const PORT = 3001; // フロントエンドと競合しないポート

// ミドルウェアの設定
app.use(cors()); // CORSを許可
app.use(express.json()); // JSON形式のリクエストボディを解析

// ルートの設定
app.use('/api/auth', authRoutes);
app.use('/api/labs', labRoutes);

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました。`);
});