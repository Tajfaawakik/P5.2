const express = require('express');
const cors = require('cors');

// ルーターのインポート
const authRoutes = require('./routes/auth.js');
const labRoutes = require('./routes/lab.js'); 
const karteRoutes = require('./routes/karte.js');
const shindanRoutes = require('./routes/shindan.js'); 
const togoRoutes = require('./routes/togo.js');
const patientRoutes = require('./routes/patient.js');

const app = express();
const PORT = 3001; // フロントエンドと競合しないポート

// ミドルウェアの設定
app.use(cors()); // CORSを許可
app.use(express.json()); // JSON形式のリクエストボディを解析

// ルートの設定
app.use('/api/auth', authRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/karte', karteRoutes); 
app.use('/api/shindan', shindanRoutes);
app.use('/api/togo', togoRoutes); 
app.use('/api/patients', patientRoutes);

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました。`);
});