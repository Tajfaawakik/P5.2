import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext.jsx'; // usePatientをインポート
import apiClient from '../api/apiClient';
import './TogoKirokuPage.css';

// --- ▼▼▼ 修正点1: 引数にpatientを追加 ▼▼▼ ---
const formatRecord = (record, patient) => {
  if (!record) return "データを取得できませんでした。";
  let text = "--- 救急初診 統合記録 ---\n\n";
  
  // --- ▼▼▼ 修正点2: 引数のpatient情報を使用 ▼▼▼ ---
  if (patient) {
    text += `患者ID: ${patient.patient_id}\n`;
    text += `氏名: ${patient.name}\n`;
  }
  
  text += `記録日時: ${new Date().toLocaleString('ja-JP')}\n`;
  text += "======================\n\n";

  // ... (残りの整形ロジックは変更なし)
  if (record.karteRecords && record.karteRecords.length > 0) {
    const rec = record.karteRecords[0];
    text += "【カルテ情報 (App1)】\n";
    text += `氏名: ${rec.record_data.patientInfo.name}, 年齢: ${rec.record_data.patientInfo.age}, 性別: ${rec.record_data.patientInfo.sex}\n`;
    text += `既往歴: ${rec.record_data.pastHistory.selected.join(', ')} (${rec.record_data.pastHistory.freeText})\n`;
    text += `ADL合計: ${rec.record_data.totalBarthelScore}点\n`;
    text += "\n";
  }
  if (record.shindanRecords && record.shindanRecords.length > 0) {
    const rec = record.shindanRecords[0];
    text += "【症候鑑別 (App2)】\n";
    text += `症候: ${rec.record_data.selectedSymptoms.join(', ')}\n`;
    const checked = Object.keys(rec.record_data.checkedDiagnoses).filter(k => rec.record_data.checkedDiagnoses[k]);
    text += `チェックした鑑別: ${checked.join(', ')}\n`;
    text += `キーワード: ${rec.record_data.selectedKeywords.join(', ')}\n`;
    text += "\n";
  }
  if (record.labResults && record.labResults.length > 0) {
    text += "【採血結果 (App3)】\n";
    record.labResults.forEach(rec => {
      text += `検査日: ${rec.test_date}\n`;
      text += `  WBC: ${rec.results.wbc || '-'}, RBC: ${rec.results.rbc || '-'}, Hb: ${rec.results.hb || '-'}\n`;
    });
    text += "\n";
  }
  return text;
};


function TogoKirokuPage() {
  const { currentPatient } = usePatient(); // currentPatientを取得
  const [recordText, setRecordText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const patientId = '12345'; // この行は不要

  const fetchAndFormatRecord = async () => {
    if (!currentPatient) {
      alert('先に患者を選択してください。');
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/togo/${currentPatient.patient_id}`);
      // --- ▼▼▼ 修正点3: currentPatientを関数に渡す ▼▼▼ ---
      const formatted = formatRecord(response.data, currentPatient);
      setRecordText(formatted);
    } catch (error) {
      console.error('統合記録の取得に失敗しました', error);
      setRecordText('記録の取得に失敗しました。サーバーが起動しているか確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(recordText).then(() => alert('統合記録をコピーしました。'));
  };
  
  if (!currentPatient) {
    return <div className="page-prompt">患者を選択してください。</div>;
  }

  return (
    <div className="togo-container">
      <h2>統合記録 (App4)</h2>
      <div className="togo-actions">
        <button onClick={fetchAndFormatRecord} disabled={isLoading}>
          {isLoading ? '記録を取得中...' : '統合記録を取得'}
        </button>
        <button onClick={copyText} disabled={!recordText}>
          クリップボードにコピー
        </button>
      </div>
      <textarea
        className="togo-output"
        value={recordText}
        readOnly
        placeholder="「統合記録を取得」ボタンを押して、全アプリの記録をここに表示します。"
      ></textarea>
    </div>
  );
}

export default TogoKirokuPage;