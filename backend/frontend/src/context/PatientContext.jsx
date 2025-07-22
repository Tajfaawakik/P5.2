import React, { createContext, useState, useContext } from 'react';

// 1. Contextオブジェクトを作成
const PatientContext = createContext();

// 2. Contextを簡単に使用するためのカスタムフックを作成
export function usePatient() {
  return useContext(PatientContext);
}

// 3. Contextを提供するProviderコンポーネントを作成
export function PatientProvider({ children }) {
  // ここでアプリ全体で共有したい状態を管理する
  const [currentPatient, setCurrentPatient] = useState(null); // 初期値は「患者未選択」でnull

  // currentPatientとsetCurrentPatientをvalueとして子コンポーネントに渡す
  const value = {
    currentPatient,
    setCurrentPatient,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
}