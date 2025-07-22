import React, { useState, useEffect } from 'react';
import { usePatient } from '../context/PatientContext.jsx';
import apiClient from '../api/apiClient.js';
import './PatientSelector.css';

function PatientSelector() {
  const { currentPatient, setCurrentPatient } = usePatient();
  const [patients, setPatients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // 新規患者登録用のState
  const [newPatientId, setNewPatientId] = useState('');
  const [newPatientName, setNewPatientName] = useState('');

  // コンポーネント表示時に患者リストを取得
  useEffect(() => {
    apiClient.get('/patients')
      .then(response => setPatients(response.data))
      .catch(error => console.error("患者リストの取得に失敗", error));
  }, []);

  const handleSelectPatient = (patient) => {
    setCurrentPatient(patient);
    setIsOpen(false);
  };
  
  const handleCreatePatient = async (e) => {
    e.preventDefault();
    if (!newPatientId || !newPatientName) {
      alert('患者IDと氏名は必須です');
      return;
    }
    const newPatientData = { patient_id: newPatientId, name: newPatientName };
    try {
      const response = await apiClient.post('/patients', newPatientData);
      const newPatient = response.data;
      setPatients(prev => [newPatient, ...prev]); // リストの先頭に追加
      setCurrentPatient(newPatient); // 作成した患者をすぐに選択
      setNewPatientId('');
      setNewPatientName('');
      setIsOpen(false);
    } catch (error) {
      console.error("患者の作成に失敗", error);
      alert('患者の作成に失敗しました');
    }
  };

  return (
    <div className="patient-selector">
      <button className="selector-button" onClick={() => setIsOpen(!isOpen)}>
        {currentPatient ? `選択中: ${currentPatient.name} (${currentPatient.patient_id})` : '患者を選択'}
      </button>

      {isOpen && (
        <div className="patient-dropdown">
          <div className="patient-list">
            {patients.map(p => (
              <div key={p.id} className="patient-item" onClick={() => handleSelectPatient(p)}>
                {p.name} ({p.patient_id})
              </div>
            ))}
          </div>
          <form className="new-patient-form" onSubmit={handleCreatePatient}>
            <input 
              type="text" 
              placeholder="新規 患者ID" 
              value={newPatientId}
              onChange={e => setNewPatientId(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="新規 氏名" 
              value={newPatientName}
              onChange={e => setNewPatientName(e.target.value)}
            />
            <button type="submit">新規登録</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PatientSelector;