import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import KartePage from './pages/KartePage';
import ShindanPage from './pages/ShindanPage';
import KensaPage from './pages/KensaPage';
import TogoKirokuPage from './pages/TogoKirokuPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; // <<<--- インポート
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* ログインページは保護しない */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 保護したいルート全体をProtectedRouteで囲む */}
        <Route element={<><Header /><main className="main-content"><ProtectedRoute /></main></>}>
          <Route path="/" element={<h2>ホーム画面：機能を選択してください</h2>} />
          <Route path="/karte" element={<KartePage />} />
          <Route path="/shindan" element={<ShindanPage />} />
          <Route path="/kensa" element={<KensaPage />} />
          <Route path="/togo" element={<TogoKirokuPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;