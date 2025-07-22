// データベース接続設定をインポート
const db = require('../config/db.js');
const bcrypt = require('bcryptjs');

class User {
  // 新しいユーザーを作成し、データベースに保存
  static async create(username, passwordHash) {
    try {
      const sql = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username';
      const result = await db.query(sql, [username, passwordHash]);
      return result.rows[0]; // 挿入されたユーザー情報を返す
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // ユーザー名でユーザーをデータベースから検索
  static async findByUsername(username) {
    try {
      const sql = 'SELECT * FROM users WHERE username = $1';
      const result = await db.query(sql, [username]);
      return result.rows[0]; // 見つかったユーザー情報（またはundefined）を返す
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }
}

module.exports = User;