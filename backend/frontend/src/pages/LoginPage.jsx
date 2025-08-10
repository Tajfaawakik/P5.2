import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/apiClient.js';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      login(response.data.token);
      navigate('/'); // ログイン成功後、トップページにリダイレクト
    } catch (err) {
      setError('ユーザー名またはパスワードが正しくありません。');
      console.error('Login failed', err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>ログイン</h2>
        <div className="form-group">
          <label htmlFor="username">ユーザー名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}

export default LoginPage;