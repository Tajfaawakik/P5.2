import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import KartePage from './pages/KartePage';
import ShindanPage from './pages/ShindanPage';
import KensaPage from './pages/KensaPage';
import TogoKirokuPage from './pages/TogoKirokuPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<h2>ホーム画面：機能を選択してください</h2>} />
          <Route path="/karte" element={<KartePage />} />
          <Route path="/shindan" element={<ShindanPage />} />
          <Route path="/kensa" element={<KensaPage />} />
          <Route path="/togo" element={<TogoKirokuPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;