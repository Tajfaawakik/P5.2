const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_for_jwt';
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    // リクエストヘッダーから 'Authorization' を取得 (例: "Bearer eyJhbGci...")
    const token = req.headers.authorization.split(' ')[1];
    
    // console.log('Verifying token with secret:', process.env.JWT_SECRET);

    // トークンを検証
    const decodedToken = jwt.verify(token, JWT_SECRET);
    
    // 検証成功後、リクエストオブジェクトにユーザー情報を付与
    req.userData = { userId: decodedToken.userId, username: decodedToken.username };
    
    // 次の処理（本来のコントローラー）へ進む
    next();
  } catch (error) {
    // トークンがない、または無効な場合はエラーを返す
    res.status(401).json({ message: '認証に失敗しました。' });
  }
};