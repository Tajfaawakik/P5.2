import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'

// 作成したPatientProviderをインポート
import { PatientProvider } from './context/PatientContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // <<<--- インポート


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* <<<--- AuthProviderを追加 */}
        <PatientProvider>
          <App />
        </PatientProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)