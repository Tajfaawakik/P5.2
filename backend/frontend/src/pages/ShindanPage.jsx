import React, { useState, useMemo } from 'react';
import medicalData from '../data/medicalData.json';
import symptomKeywords from '../data/symptomKeywords.json';
import './ShindanPage.css';

// 診断ポイントのテキストを解析し、キーワードをハイライトする関数
const HighlightedText = ({ text }) => {
  const keywords = useMemo(() => new Set(symptomKeywords), []);
  const parts = text.split(new RegExp(`(${[...keywords].join('|')})`, 'g'));

  return (
    <span>
      {parts.map((part, index) => 
        keywords.has(part) ? <strong key={index} className="keyword">{part}</strong> : part
      )}
    </span>
  );
};


function ShindanPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [checkedDiagnoses, setCheckedDiagnoses] = useState({});
  const [pinnedDiagnoses, setPinnedDiagnoses] = useState([]);
  const [generatedText, setGeneratedText] = useState('');

  // 選択された症候に基づいて鑑別疾患リストを生成
  const differentialDiagnoses = useMemo(() => {
    if (selectedSymptoms.length === 0) return [];
    
    const allDiagnoses = selectedSymptoms.flatMap(symptom => 
      medicalData.find(d => d.symptom === symptom)?.differential_diagnoses || []
    );
    // 重複を除去
    const uniqueDiagnoses = Array.from(new Map(allDiagnoses.map(d => [d.name, d])).values());
    return uniqueDiagnoses;
  }, [selectedSymptoms]);

  // 症候ボタンのクリック処理
  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };
  
  // 鑑別疾患のチェックボックス処理
  const toggleDiagnosisCheck = (name) => {
    setCheckedDiagnoses(prev => ({...prev, [name]: !prev[name]}));
  };
  
  // ピン留め処理
  const togglePin = (diagnosis) => {
    setPinnedDiagnoses(prev => 
      prev.some(d => d.name === diagnosis.name) 
        ? prev.filter(d => d.name !== diagnosis.name) 
        : [...prev, diagnosis]
    );
  };
  
  // 記録用テキストを生成
  const generateText = () => {
    let text = `【主訴・症候】\n- ${selectedSymptoms.join(', ')}\n\n`;
    text += `【鑑別疾患】\n`;
    Object.entries(checkedDiagnoses).forEach(([name, isChecked]) => {
      if (isChecked) {
        text += `- ${name}\n`;
      }
    });
    text += `\n【キーワード】\n\n`; // キーワード機能は今回省略
    setGeneratedText(text);
  };

  // テキストをコピー
  const copyText = () => {
    navigator.clipboard.writeText(generatedText).then(() => alert('記録用テキストをコピーしました。'));
  };

  const unpinnedDiagnoses = differentialDiagnoses.filter(d => !pinnedDiagnoses.some(pd => pd.name === d.name));

  return (
    <div className="shindan-container">
      <h2>症候鑑別支援 (App2)</h2>
      <div className="shindan-grid">
        {/* 左側の選択エリア */}
        <div className="symptom-selection-area">
          <h3>症候を選択</h3>
          <div className="symptom-buttons">
            {medicalData.map(item => (
              <button 
                key={item.symptom} 
                onClick={() => toggleSymptom(item.symptom)}
                className={selectedSymptoms.includes(item.symptom) ? 'active' : ''}
              >
                {item.symptom}
              </button>
            ))}
          </div>
        </div>
        
        {/* 中央の鑑別疾患表示エリア */}
        <div className="diagnosis-display-area">
          <h3>鑑別疾患リスト</h3>
          {selectedSymptoms.length === 0 && <p>症候を選択してください。</p>}
          
          {/* ピン留めされた項目 */}
          {pinnedDiagnoses.length > 0 && <div className="pinned-section"><h4>ピン留め済み</h4>{pinnedDiagnoses.map(d => renderDiagnosis(d, true))}</div>}
          
          {/* 通常の項目 */}
          {unpinnedDiagnoses.map(d => renderDiagnosis(d, false))}
        </div>

        {/* 右側の出力エリア */}
        <div className="output-generation-area">
            <h3>記録用テキスト</h3>
            <div className="memo-actions">
                <button onClick={generateText}>テキスト生成</button>
                <button onClick={copyText} disabled={!generatedText}>コピー</button>
            </div>
            <textarea
                value={generatedText}
                readOnly
                placeholder="ここに記録用のテキストが生成されます"
            ></textarea>
        </div>
      </div>
    </div>
  );
  
  // 鑑別疾患を描画するヘルパー関数
  function renderDiagnosis(d, isPinned) {
      return (
        <div key={d.name} className="diagnosis-card">
          <div className="card-header">
            <input type="checkbox" onChange={() => toggleDiagnosisCheck(d.name)} checked={!!checkedDiagnoses[d.name]}/>
            <h4>{d.name}</h4>
            <button className="pin-button" onClick={() => togglePin(d)}>{isPinned ? '★' : '☆'}</button>
          </div>
          <div className="card-body">
            <p><strong>医療面接のポイント:</strong></p>
            <ul>{d.interview_points.map((p, i) => <li key={i}><HighlightedText text={p} /></li>)}</ul>
            <p><strong>身体診察のポイント:</strong></p>
            <ul>{d.physical_exam_points.map((p, i) => <li key={i}><HighlightedText text={p} /></li>)}</ul>
          </div>
        </div>
      );
  }
}

export default ShindanPage;