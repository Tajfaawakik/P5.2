import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import './TogoKirokuPage.css';

// 取得したデータを整形してテキスト化する関数
const formatRecord = (record) => {
  if (!record) return "データを取得できませんでした。";
  let text = "--- 救急初診 統合記録 ---\n\n";
  const patientId = '12345'; // 固定
  text += `患者ID: ${patientId}\n`;
  text += `記録日時: ${new Date().toLocaleString('ja-JP')}\n`;
  text += "======================\n\n";

  // App1: カルテ記載
  if (record.karteRecords && record.karteRecords.length > 0) {
    const rec = record.karteRecords[record.karteRecords.length - 1]; // 最新の記録を取得
    text += "【カルテ情報 (App1)】\n";
    text += `氏名: ${rec.patientInfo.name}, 年齢: ${rec.patientInfo.age}, 性別: ${rec.patientInfo.sex}\n`;
    text += `既往歴: ${rec.pastHistory.selected.join(', ')} (${rec.pastHistory.freeText})\n`;
    text += `ADL合計: ${rec.totalBarthelScore}点\n`;
    text += "\n";
  }

  // App2: 症候鑑別
  if (record.shindanRecords && record.shindanRecords.length > 0) {
    const rec = record.shindanRecords[record.shindanRecords.length - 1]; // 最新の記録
    text += "【症候鑑別 (App2)】\n";
    text += `症候: ${rec.selectedSymptoms.join(', ')}\n`;
    const checked = Object.keys(rec.checkedDiagnoses).filter(k => rec.checkedDiagnoses[k]);
    text += `チェックした鑑別: ${checked.join(', ')}\n`;
    text += `選択したキーワード: ${rec.selectedKeywords.join(', ')}\n`;
    text += "\n";
  }

  // App3: 採血結果
  if (record.labResults && record.labResults.length > 0) {
    text += "【採血結果 (App3)】\n";
    record.labResults.forEach(rec => {
      text += `検査日: ${rec.testDate}\n`;
      text += `  WBC: ${rec.results.wbc || '-'}, RBC: ${rec.results.rbc || '-'}, Hb: ${rec.results.hb || '-'}\n`;
    });
    text += "\n";
  }

  return text;
};

function TogoKirokuPage() {
  const [recordText, setRecordText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const patientId = '12345'; // 将来的に動的にする

  const fetchAndFormatRecord = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/togo/${patientId}`);
      const formatted = formatRecord(response.data);
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