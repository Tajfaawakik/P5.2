import React, { useState, useMemo, useEffect } from 'react';
import { usePatient } from '../context/PatientContext.jsx';
import historiesData from '../data/histories.json';
import medSuggestionsData from '../data/med_suggestions.json';
import apiClient from '../api/apiClient';
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

// フォームの初期状態を定義
const initialPatientInfo = { name: '', age: '', sex: '男性' };
const initialPastHistory = { selected: [], freeText: '' };
const initialMedications = [];
const initialBarthelScores = {};

function KartePage() {
  const { currentPatient } = usePatient();
  
  const [patientInfo, setPatientInfo] = useState(initialPatientInfo);
  const [pastHistory, setPastHistory] = useState(initialPastHistory);
  const [medications, setMedications] = useState(initialMedications);
  const [barthelScores, setBarthelScores] = useState(initialBarthelScores);
  const [generatedMemo, setGeneratedMemo] = useState('');

  // 患者が変更されたときにデータを取得する
  useEffect(() => {
    const resetForm = () => {
      setPatientInfo(initialPatientInfo);
      setPastHistory(initialPastHistory);
      setMedications(initialMedications);
      setBarthelScores(initialBarthelScores);
      setGeneratedMemo('');
    };

    if (currentPatient) {
      apiClient.get(`/karte/${currentPatient.patient_id}`)
        .then(response => {
          const data = response.data.record_data;
          setPatientInfo(data.patientInfo || initialPatientInfo);
          setPastHistory(data.pastHistory || initialPastHistory);
          setMedications(data.medications || initialMedications);
          setBarthelScores(data.barthelScores || initialBarthelScores);
        })
        .catch(error => {
          console.log(`患者 ${currentPatient.patient_id} のカルテ記録はありません。`);
          resetForm();
        });
    } else {
      resetForm();
    }
  }, [currentPatient]);

  const toggleHistory = (history) => {
    setPastHistory(prev => {
      const newSelected = prev.selected.includes(history)
        ? prev.selected.filter(h => h !== history)
        : [...prev.selected, history];
      return { ...prev, selected: newSelected };
    });
  };
  
  // 候補ボタンで薬剤をトグル（追加/削除）する
  const toggleMedication = (medName) => {
    setMedications(prev => {
      const exists = prev.some(med => med.name === medName);
      if (exists) {
        // 存在するなら削除
        return prev.filter(med => med.name !== medName);
      } else {
        // 存在しないなら追加
        const blankIndex = prev.findIndex(med => med.name === '');
        // 空の行があれば、そこを埋める
        if (blankIndex !== -1) {
          const newMeds = [...prev];
          newMeds[blankIndex] = { name: medName, dose: '' };
          return newMeds;
        }
        // 空の行がなければ、末尾に追加
        return [...prev, { name: medName, dose: '' }];
      }
    });
  };
  
  // 入力欄の値を更新する
  const handleMedicationChange = (index, field, value) => {
    const newMeds = [...medications];
    newMeds[index][field] = value;
    setMedications(newMeds);
  };

  // 空の入力欄を一行だけ追加する
  const addMedicationRow = () => {
    // 既に空の行があるかチェック
    const hasBlankRow = medications.some(med => med.name === '');
    if (!hasBlankRow) {
      setMedications([...medications, { name: '', dose: '' }]);
    }
  };
  
  // 指定した行を削除する
  const removeMedicationRow = (index) => {
    const newMeds = medications.filter((_, i) => i !== index);
    setMedications(newMeds);
  };
  
  
  const totalBarthelScore = useMemo(() => {
    return Object.values(barthelScores).reduce((sum, score) => sum + (parseInt(score, 10) || 0), 0);
  }, [barthelScores]);

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
  
  const copyMemo = () => {
    navigator.clipboard.writeText(generatedMemo).then(() => {
      alert('カルテ用メモをコピーしました。');
    });
  };

  const handleSave = async () => {
    if (!currentPatient) {
        alert('患者が選択されていません。');
        return;
    }
    const dataToSave = {
      patientId: currentPatient.patient_id,
      recordData: {
        patientInfo,
        pastHistory,
        medications,
        barthelScores,
        totalBarthelScore,
      }
    };
    try {
      await apiClient.post('/karte', dataToSave);
      alert('入力内容をサーバーに保存しました。');
    } catch (error) {
      console.error('保存に失敗しました', error);
      alert('サーバーへの保存に失敗しました。');
    }
  };
  
  if (!currentPatient) {
    return <div className="page-prompt">患者を選択してください。</div>;
  }

  return (
    <div className="karte-container">
      <h2>カルテ記載支援 (App1)</h2>
      <div className="karte-grid">
        <div className="input-area">
          <section><h3>患者基本情報</h3>
            <input type="text" placeholder="氏名" value={patientInfo.name} onChange={e => setPatientInfo({...patientInfo, name: e.target.value})} />
            <input type="number" placeholder="年齢" value={patientInfo.age} onChange={e => setPatientInfo({...patientInfo, age: e.target.value})} />
            <select value={patientInfo.sex} onChange={e => setPatientInfo({...patientInfo, sex: e.target.value})}>
              <option>男性</option><option>女性</option>
            </select>
          </section>
          <section><h3>既往歴</h3>
            <div className="button-group">
              {historiesData.map(h => 
                <button key={h} onClick={() => toggleHistory(h)} className={pastHistory.selected.includes(h) ? 'active' : ''}>{h}</button>
              )}
            </div>
            <textarea placeholder="手術歴など自由記述" rows="2" value={pastHistory.freeText} onChange={e => setPastHistory({...pastHistory, freeText: e.target.value})}></textarea>
          </section>
          <section>
            <h3>内服薬</h3>
            
            {/* 候補ボタン */}
            {pastHistory.selected.length > 0 && <p className="suggestion-guide">候補（クリックで追加/削除）:</p>}
            <div className="button-group">
              {pastHistory.selected.flatMap(h => medSuggestionsData[h] || []).map(med =>
                <button 
                  key={med} 
                  className={medications.some(m => m.name === med) ? 'active' : ''}
                  onClick={() => toggleMedication(med)}
                >
                  {med}
                </button>
              )}
            </div>

            {/* 薬剤入力欄リスト */}
            <div className="medication-list">
              {medications.map((med, index) => (
                <div key={index} className="med-row">
                  <input 
                    type="text" 
                    placeholder="薬剤名" 
                    value={med.name} 
                    onChange={e => handleMedicationChange(index, 'name', e.target.value)} 
                  />
                  <input 
                    type="text" 
                    placeholder="用法・用量" 
                    value={med.dose} 
                    onChange={e => handleMedicationChange(index, 'dose', e.target.value)} 
                  />
                  <button className="remove-med-button" onClick={() => removeMedicationRow(index)}>×</button>
                </div>
              ))}
            </div>
            <button onClick={addMedicationRow}>手動で薬剤を追加</button>
          </section>
          {/* --- ▲▲▲ --- */}
          <section><h3>ADL評価 (Barthel Index) - 合計: {totalBarthelScore}点</h3>
            {barthelItems.map(item => (
              <div key={item.id} className="adl-row">
                <label>{item.label}</label>
                <select value={barthelScores[item.id] || ''} onChange={e => setBarthelScores({...barthelScores, [item.id]: e.target.value})}>
                  <option value="">選択</option>
                  {item.points.map(p => <option key={p} value={p}>{p}点</option>)}
                </select>
              </div>
            ))}
          </section>
        </div>
        <div className="output-area">
          <div className="memo-actions">
            <button onClick={handleSave}>サーバーに保存</button>
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