import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PatientSelector from './PatientSelector';
import { useAuth } from '../context/AuthContext.jsx'; // <<<--- インポート
import './Header.css';

function Header() {
  const { user, logout } = useAuth(); // <<<--- user情報とlogout関数を取得
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>救急初診支援統合アプリ</h1>
        <nav>
          <Link to="/karte" className="nav-button">カルテ記載</Link>
          <Link to="/shindan" className="nav-button">症候鑑別</Link>
          <Link to="/kensa" className="nav-button">採血結果</Link>
          <Link to="/togo" className="nav-button">統合記録</Link>
        </nav>
      </div>
      <div className="header-right">
        {/* ▼▼▼ 以下を修正 ▼▼▼ */}
        <div className="user-info">
          {user && <span>{user.username} としてログイン中</span>}
          <button onClick={handleLogout} className="logout-button">ログアウト</button>
        </div>
        <PatientSelector />
      </div>
    </header>
  );
}

export default Header;