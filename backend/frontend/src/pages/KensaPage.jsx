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
        setHistoricalData(response.data);
      } catch (error) {
        console.error('履歴の取得に失敗しました', error);
      }
    };
    fetchHistoricalData();
  }, [patientId]);

  const groupedItems = useMemo(() => {
    // (この部分は変更なし)
    return testItemsData.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }, []);

  const handleInputChange = (id, value) => {
    setLabResults(prev => ({ ...prev, [id]: value }));
  };

  const isAbnormal = (item, value) => {
    // (この部分は変更なし)
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