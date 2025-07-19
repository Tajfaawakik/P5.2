import React, { useState, useMemo } from 'react';
import historiesData from '../data/histories.json';
import medSuggestionsData from '../data/med_suggestions.json';
import './KartePage.css';

// Barthel Indexの評価項目
const barthelItems = [
  { id: 'meal', label: '食事', points: [10, 5, 0] },
  { id: 'transfer', label: '移乗', points: [15, 10, 5, 0] },
  { id: 'grooming', label: '整容', points: [5, 0] },
  { id: 'toilet', label: 'トイレ動作', points: [10, 5, 0] },
  { id: 'bathing', label: '入浴', points: [5, 0] },
  { id: 'walking', label: '歩行', points: [15, 10, 5, 0] },
  { id: 'stairs', label: '階段昇降', points: [10, 5, 0] },
  { id: 'dressing', label: '着替え', points: [10, 5, 0] },
  { id: 'bowels', label: '排便コントロール', points: [10, 5, 0] },
  { id: 'bladder', label: '排尿コントロール', points: [10, 5, 0] },
];

function KartePage() {
  const [patientInfo, setPatientInfo] = useState({ name: '', age: '', sex: '男性' });
  const [pastHistory, setPastHistory] = useState({ selected: [], freeText: '' });
  const [medications, setMedications] = useState([{ name: '', dose: '' }]);
  const [barthelScores, setBarthelScores] = useState({});
  const [generatedMemo, setGeneratedMemo] = useState('');

  // 既往歴ボタンのクリック処理
  const toggleHistory = (history) => {
    setPastHistory(prev => {
      const newSelected = prev.selected.includes(history)
        ? prev.selected.filter(h => h !== history)
        : [...prev.selected, history];
      return { ...prev, selected: newSelected };
    });
  };
  
  // 薬の入力欄を追加
  const addMedication = () => setMedications([...medications, { name: '', dose: '' }]);
  
  // 薬の入力内容を更新
  const handleMedicationChange = (index, field, value) => {
    const newMeds = [...medications];
    newMeds[index][field] = value;
    setMedications(newMeds);
  };
  
  // Barthel Indexのスコアを計算
  const totalBarthelScore = useMemo(() => {
    return Object.values(barthelScores).reduce((sum, score) => sum + (parseInt(score, 10) || 0), 0);
  }, [barthelScores]);

  // カルテ用メモを生成
  const generateMemo = () => {
    let memo = `【患者情報】\n氏名: ${patientInfo.name}, 年齢: ${patientInfo.age}, 性別: ${patientInfo.sex}\n\n`;
    memo += `【主訴】\n\n\n`;
    memo += `【現病歴】\n\n\n`;
    memo += `【既往歴】\n- ${pastHistory.selected.join(', ')}\n- ${pastHistory.freeText}\n\n`;
    memo += `【内服薬】\n${medications.map(m => `- ${m.name} ${m.dose}`).join('\n')}\n\n`;
    memo += `【ADL (Barthel Index)】\n- ${totalBarthelScore}点\n\n`;
    memo += `【身体所見】\n\n\n`;
    memo += `【検査結果】\n\n\n`;
    memo += `【アセスメント＆プラン】\n\n\n`;
    setGeneratedMemo(memo);
  };
  
  // メモをクリップボードにコピー
  const copyMemo = () => {
    navigator.clipboard.writeText(generatedMemo).then(() => {
      alert('カルテ用メモをコピーしました。');
    });
  };

  return (
    <div className="karte-container">
      <h2>カルテ記載支援 (App1)</h2>
      <div className="karte-grid">
        {/* 左側の入力エリア */}
        <div className="input-area">
          {/* 患者情報 */}
          <section><h3>患者基本情報</h3>
            <input type="text" placeholder="氏名" onChange={e => setPatientInfo({...patientInfo, name: e.target.value})} />
            <input type="number" placeholder="年齢" onChange={e => setPatientInfo({...patientInfo, age: e.target.value})} />
            <select onChange={e => setPatientInfo({...patientInfo, sex: e.target.value})}>
              <option>男性</option><option>女性</option>
            </select>
          </section>
          {/* 既往歴 */}
          <section><h3>既往歴</h3>
            <div className="button-group">
              {historiesData.map(h => 
                <button key={h} onClick={() => toggleHistory(h)} className={pastHistory.selected.includes(h) ? 'active' : ''}>{h}</button>
              )}
            </div>
            <textarea placeholder="手術歴など自由記述" rows="2" onChange={e => setPastHistory({...pastHistory, freeText: e.target.value})}></textarea>
          </section>
          {/* 内服薬 */}
          <section><h3>内服薬</h3>
            {pastHistory.selected.length > 0 && <p className="suggestion-guide">候補:</p>}
            <div className="button-group">
              {pastHistory.selected.flatMap(h => medSuggestionsData[h] || []).map(med =>
                <button key={med} className="suggestion" onClick={() => handleMedicationChange(medications.length - 1, 'name', med)}>{med}</button>
              )}
            </div>
            {medications.map((med, index) => (
              <div key={index} className="med-row">
                <input type="text" placeholder="薬剤名" value={med.name} onChange={e => handleMedicationChange(index, 'name', e.target.value)} />
                <input type="text" placeholder="用法・用量" value={med.dose} onChange={e => handleMedicationChange(index, 'dose', e.target.value)} />
              </div>
            ))}
            <button onClick={addMedication}>薬剤を追加</button>
          </section>
          {/* ADL評価 */}
          <section><h3>ADL評価 (Barthel Index) - 合計: {totalBarthelScore}点</h3>
            {barthelItems.map(item => (
              <div key={item.id} className="adl-row">
                <label>{item.label}</label>
                <select onChange={e => setBarthelScores({...barthelScores, [item.id]: e.target.value})}>
                  <option value="">選択</option>
                  {item.points.map(p => <option key={p} value={p}>{p}点</option>)}
                </select>
              </div>
            ))}
          </section>
        </div>
        {/* 右側の出力エリア */}
        <div className="output-area">
          <div className="memo-actions">
            <button onClick={generateMemo}>カルテ用メモを生成</button>
            <button onClick={copyMemo} disabled={!generatedMemo}>クリップボードにコピー</button>
          </div>
          <textarea 
            className="memo-output"
            value={generatedMemo}
            readOnly
            placeholder="ここにカルテ用のメモが生成されます"
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default KartePage;