import React, { useState, useMemo } from 'react';
import medicalData from '../data/medicalData.json';
import symptomKeywords from '../data/symptomKeywords.json';
import './ShindanPage.css';

// --- ▼▼▼ InteractiveTextコンポーネントを修正 ▼▼▼ ---
// テキスト内のキーワードをクリック可能にし、選択状態に応じてハイライトを切り替える
const InteractiveText = ({ text, selectedKeywords, onKeywordClick }) => {
  const allKeywords = useMemo(() => new Set(symptomKeywords), []);
  const parts = text.split(new RegExp(`(${[...allKeywords].join('|')})`, 'g'));

  return (
    <span>
      {parts.map((part, index) => {
        if (allKeywords.has(part)) {
          const isSelected = selectedKeywords.includes(part);
          return (
            <span 
              key={index} 
              className={`keyword ${isSelected ? 'selected' : ''}`}
              onClick={() => onKeywordClick(part)}
            >
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};


function ShindanPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [checkedDiagnoses, setCheckedDiagnoses] = useState({});
  const [pinnedDiagnoses, setPinnedDiagnoses] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]); // <<<--- キーワード選択状態を追加
  const [generatedText, setGeneratedText] = useState('');

  const differentialDiagnoses = useMemo(() => {
    if (selectedSymptoms.length === 0) return [];
    const allDiagnoses = selectedSymptoms.flatMap(symptom => 
      medicalData.find(d => d.symptom === symptom)?.differential_diagnoses || []
    );
    const uniqueDiagnoses = Array.from(new Map(allDiagnoses.map(d => [d.name, d])).values());
    return uniqueDiagnoses;
  }, [selectedSymptoms]);
  
  // --- ▼▼▼ キーワードのオン/オフを切り替える関数を追加 ▼▼▼ ---
  const toggleKeyword = (keyword) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };
  
  const toggleDiagnosisCheck = (name) => {
    setCheckedDiagnoses(prev => ({...prev, [name]: !prev[name]}));
  };
  
  const togglePin = (diagnosis) => {
    setPinnedDiagnoses(prev => 
      prev.some(d => d.name === diagnosis.name) 
        ? prev.filter(d => d.name !== diagnosis.name) 
        : [...prev, diagnosis]
    );
  };
  
  // --- ▼▼▼ 生成テキストにキーワードを含めるように修正 ▼▼▼ ---
  const generateText = () => {
    let text = `【主訴・症候】\n- ${selectedSymptoms.join(', ')}\n\n`;
    text += `【鑑別疾患】\n`;
    Object.entries(checkedDiagnoses).forEach(([name, isChecked]) => {
      if (isChecked) {
        text += `- ${name}\n`;
      }
    });
    text += `\n【キーワード】\n- ${selectedKeywords.join(', ')}\n`;
    setGeneratedText(text);
  };

  const copyText = () => {
    navigator.clipboard.writeText(generatedText).then(() => alert('記録用テキストをコピーしました。'));
  };

  const unpinnedDiagnoses = differentialDiagnoses.filter(d => !pinnedDiagnoses.some(pd => pd.name === d.name));

  return (
    <div className="shindan-container">
      <h2>症候鑑別支援 (App2)</h2>
      <div className="shindan-grid">
        <div className="symptom-selection-area">
          {/* ... 症候選択エリアは変更なし ... */}
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
        
        <div className="diagnosis-display-area">
          <h3>鑑別疾患リスト</h3>
          {selectedSymptoms.length === 0 && <p>症候を選択してください。</p>}
          {pinnedDiagnoses.length > 0 && <div className="pinned-section"><h4>ピン留め済み</h4>{pinnedDiagnoses.map(d => renderDiagnosis(d, true))}</div>}
          {unpinnedDiagnoses.map(d => renderDiagnosis(d, false))}
        </div>

        <div className="output-generation-area">
            {/* --- ▼▼▼ 選択したキーワードのリスト表示を追加 ▼▼▼ --- */}
            <div className="selected-keywords-box">
                <h4>選択中キーワード</h4>
                {selectedKeywords.length > 0 ? (
                    <div className="selected-keywords-list">
                        {selectedKeywords.map(k => <span key={k} className="keyword-tag">{k}</span>)}
                    </div>
                ) : <p>キーワードをクリックして選択</p>}
            </div>
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
  
  // --- ▼▼▼ renderDiagnosis内の呼び出しを修正 ▼▼▼ ---
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
            <ul>{d.interview_points.map((p, i) => <li key={i}><InteractiveText text={p} selectedKeywords={selectedKeywords} onKeywordClick={toggleKeyword} /></li>)}</ul>
            <p><strong>身体診察のポイント:</strong></p>
            <ul>{d.physical_exam_points.map((p, i) => <li key={i}><InteractiveText text={p} selectedKeywords={selectedKeywords} onKeywordClick={toggleKeyword} /></li>)}</ul>
          </div>
        </div>
      );
  }
}

export default ShindanPage;