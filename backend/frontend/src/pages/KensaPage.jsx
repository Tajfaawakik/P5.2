import React, { useState, useMemo, useEffect } from 'react';
import testItemsData from '../data/test_items.json';
import apiClient from '../api/apiClient'; // APIクライアントをインポート
import './KensaPage.css';

function KensaPage() {
  const [labResults, setLabResults] = useState({});
  const [historicalData, setHistoricalData] = useState([]); // 履歴データ用のstate
  const patientId = '12345'; // 患者IDを固定（将来的に動的にする）

  // 初回レンダリング時またはpatientId変更時に過去のデータを取得
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await apiClient.get(`/labs/${patientId}`);
        // --- ▼▼▼ BUG FIX 1: 正しいソート順（新しい順）に修正 ▼▼▼ ---
        const sortedData = response.data.sort((a, b) => new Date(b.test_date) - new Date(a.test_date));
        setHistoricalData(sortedData);
      } catch (error) {
        console.error('履歴の取得に失敗しました', error);
      }
    };
    fetchHistoricalData();
  }, [patientId]);

  // 入力欄がフォーカスされたときの処理
  const handleInputFocus = (e, item) => {
    const { id, min, max } = item;
    const currentValue = labResults[id];

    // シナリオ3: 既に入力値があれば、その値を全選択する
    if (currentValue !== undefined && currentValue !== '') {
      e.target.select();
      return;
    }

    // --- ▼▼▼ BUG FIX 2: 最新の履歴を正しく参照するように修正 ▼▼▼ ---
    const latestRecord = historicalData.length > 0 ? historicalData[0] : null;


    // シナリオ1: 前回値があれば引用する
    if (latestRecord && latestRecord.results && latestRecord.results[id] !== undefined) {
      handleInputChange(id, latestRecord.results[id]);
      return;
    }
    // シナリオ2: 前回値がなければ、標準値を計算して入力する
    if (min !== undefined && max !== undefined) {
      const normalValue = Math.round(((min + max) / 2) * 100) / 100;
      handleInputChange(id, normalValue);
    }
  };

  // キーボードのキーが押されたときの処理
  const handleKeyDown = (e, item) => {
    if (e.target.value === '') {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleInputChange(item.id, item.max);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleInputChange(item.id, item.min);
      }
    }
  };

  const groupedItems = useMemo(() => {
    return testItemsData.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  }, []);

  const handleInputChange = (id, value) => {
    setLabResults(prev => ({ ...prev, [id]: value }));
  };

  const isAbnormal = (item, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    return numValue < item.min || numValue > item.max;
  };

  // 保存ボタンの処理をAPI通信に書き換え
  const handleSave = async () => {
    const dataToSave = {
      patientId: patientId,
      testDate: new Date().toISOString().split('T')[0], // 今日の日付
      results: labResults,
    };

    try {
      const response = await apiClient.post('/labs', dataToSave);
      alert('データが保存されました。');
      // 保存後、履歴を再取得して画面を更新
      setHistoricalData(prev => [...prev, response.data]);
      setLabResults({}); // 入力フォームをクリア
    } catch (error) {
      console.error('データの保存に失敗しました', error);
      alert('データの保存に失敗しました。');
    }
  };

  return (
    <div className="kensa-container">
      <h2>採血結果入力 (App3)</h2>
      <div className="patient-info-bar">
        <span>患者ID: {patientId}</span>
        <button onClick={handleSave} className="save-button">この内容で保存</button>
      </div>
      <div className="results-grid">
        {/* ... 入力フォームの部分は変更なし ... */}
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="category-group">
            <h3>{category}</h3>
            {items.map(item => (
              <div key={item.id} className="input-row">
                <label htmlFor={item.id}>{item.name}</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id={item.id}
                    step={item.step}
                    value={labResults[item.id] || ''}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    onFocus={(e) => handleInputFocus(e, item)} // <<<--- onFocusイベントを追加
                    onKeyDown={(e) => handleKeyDown(e, item)} // <<<--- onKeyDownイベントを追加
                    className={isAbnormal(item, labResults[item.id]) ? 'abnormal' : ''}
                  />
                  <span>{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 履歴表示エリア */}
      <div className="history-section">
        <h3>検査履歴</h3>
        {historicalData.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>検査日</th>
                <th>WBC</th>
                <th>RBC</th>
                <th>Hb</th>
                {/* 他の主要項目もここに追加可能 */}
              </tr>
            </thead>
            <tbody>
              {historicalData.map(record => (
                <tr key={record.id}>
                  <td>{record.testDate}</td>
                  <td>{record.results.wbc || '-'}</td>
                  <td>{record.results.rbc || '-'}</td>
                  <td>{record.results.hb || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>この患者の検査履歴はありません。</p>
        )}
      </div>
    </div>
  );
}

export default KensaPage;