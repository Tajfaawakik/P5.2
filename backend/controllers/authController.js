const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key'; // 本番環境では環境変数などを使ってください

// ユーザー登録処理
exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'ユーザー名とパスワードは必須です。' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create(username, hashedPassword);
    res.status(201).json({ message: 'ユーザー登録が完了しました。', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました。', error });
  }
};

// ログイン処理
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'ユーザー名とパスワードは必須です。' });
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: '認証に失敗しました。' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '認証に失敗しました。' });
    }

    // JWTトークンを生成
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'ログイン成功', token });
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました。', error });
  }
};