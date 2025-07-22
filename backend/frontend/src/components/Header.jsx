import React from 'react';
import { Link } from 'react-router-dom';
import PatientSelector from './PatientSelector'; // <<<--- インポート
import './Header.css';

function Header() {
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
        <PatientSelector /> {/* <<<--- ここに配置 */}
      </div>
    </header>
  );
}

export default Header;