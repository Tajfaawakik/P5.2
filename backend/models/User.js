// ここでは、PostgreSQLに接続するための 'pg' ライブラリのプール機能を想定しています。
// 実際のデータベース接続設定は server.js などで行います。

class User {
  // 新しいユーザーを作成
  static async create(username, passwordHash) {
    // const result = await pool.query(
    //   'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    //   [username, passwordHash]
    // );
    // return result.rows[0];
    console.log(`User created (mock): ${username}`);
    // モックアップ：実際にはデータベースに保存します
    return { id: 1, username: username };
  }

  // ユーザー名でユーザーを検索
  static async findByUsername(username) {
    // const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    // return result.rows[0];
    console.log(`Finding user (mock): ${username}`);
    // モックアップ：実際にはデータベースから取得します
    if (username === 'testuser') {
      // bcrypt.hash('password123', 10) で生成したハッシュの例
      return { id: 1, username: 'testuser', password: '$2a$10$f/U.G5g.3WzDG..L51r4d.y/x0BCW4dot/lJ29xJgfqyJ.kG8/CLe' };
    }
    return null;
  }
}

module.exports = User;