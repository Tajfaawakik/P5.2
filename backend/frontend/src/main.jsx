import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'

// 作成したPatientProviderをインポート
import { PatientProvider } from './context/PatientContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* PatientProviderで全体を囲む */}
    <PatientProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PatientProvider>
  </React.StrictMode>,
)