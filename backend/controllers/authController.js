const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// .envファイルから秘密鍵を読み込む
const JWT_SECRET = process.env.JWT_SECRET;

// ユーザー登録処理
exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'ユーザー名とパスワードは必須です。' });
  }

  try {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create(username, hashedPassword);
    res.status(201).json({ message: 'ユーザー登録が完了しました。', userId: newUser.id });
  } catch (error) {
    // ユーザー名が重複している場合などのエラーをハンドル
    if (error.code === '23505') { // PostgreSQLのunique制約違反エラーコード
        return res.status(409).json({ message: 'そのユーザー名は既に使用されています。'});
    }
    res.status(500).json({ message: 'サーバーエラーが発生しました。', error: error.message });
  }
};

// ログイン処理
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'ユーザー名とパスワードは必須です。' });
  }

  try {
    // ユーザー名でユーザーを検索
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: '認証に失敗しました。' });
    }

    // パスワードを比較
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '認証に失敗しました。' });
    }

    // JWTトークンを生成
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'ログイン成功', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'サーバーエラーが発生しました。', error: error.message });
  }
};

//ログ用
// const User = require('../models/User.js');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// // const JWT_SECRET = 'your_jwt_secret_key'; // 本番環境では環境変数などを使ってください
// const JWT_SECRET = process.env.JWT_SECRET;

// // ユーザー登録処理
// exports.register = async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).json({ message: 'ユーザー名とパスワードは必須です。' });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create(username, hashedPassword);
//     res.status(201).json({ message: 'ユーザー登録が完了しました。', userId: newUser.id });
//   } catch (error) {
//     res.status(500).json({ message: 'サーバーエラーが発生しました。', error });
//   }
// };

// // ログイン処理
// // 
// // ログイン処理（デバッグ用のログ出力付き）
// exports.login = async (req, res) => {
//   console.log('\n--- ログインリクエスト受信 ---');
//   const { username, password } = req.body;
//   console.log(`リクエストされたユーザー名: ${username}`);

//   try {
//     console.log('[Step 1/3] データベースからユーザーを検索します...');
//     const user = await User.findByUsername(username);

//     if (!user) {
//       console.log('[Step 1 FAILED] ユーザーが見つかりませんでした。');
//       return res.status(401).json({ message: '認証に失敗しました。' });
//     }
//     console.log('[Step 1 SUCCESS] ユーザーが見つかりました。');
//     // console.log(user); // 必要であればユーザー情報も表示

//     console.log('[Step 2/3] パスワードを比較します...');
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       console.log('[Step 2 FAILED] パスワードが一致しませんでした。');
//       return res.status(401).json({ message: '認証に失敗しました。' });
//     }
//     console.log('[Step 2 SUCCESS] パスワードが一致しました。');

//     console.log('[Step 3/3] JWTトークンを生成します...');
//     const secretKey = process.env.JWT_SECRET;
//     console.log(`使用する秘密鍵(JWT_SECRET): ${secretKey ? '設定済み' : '未設定 or 空です！'}`);

//     const token = jwt.sign(
//       { userId: user.id, username: user.username },
//       secretKey,
//       { expiresIn: '1h' }
//     );
//     console.log('[Step 3 SUCCESS] トークンが生成されました。');

//     res.json({ message: 'ログイン成功', token });

//   } catch (error) {
//     console.error('\n!!! ログイン処理中にクラッシュエラーが発生しました !!!');
//     console.error(error); // <<<--- これが最も重要なエラー情報です
//     res.status(500).json({ message: 'サーバーエラーが発生しました。', error: error.message });
//   }
// };