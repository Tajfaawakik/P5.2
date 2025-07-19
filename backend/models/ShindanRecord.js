// モックデータベース
const mockDatabase = [];
let nextId = 1;

class ShindanRecord {
  static async save(shindanData) {
    // 実際には患者IDなども含めて保存する
    const newEntry = { id: nextId++, ...shindanData, savedAt: new Date() };
    mockDatabase.push(newEntry);
    console.log('Saved to mock DB (Shindan):', newEntry);
    return newEntry;
  }
}

module.exports = ShindanRecord;