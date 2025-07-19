// モックデータベース
const mockDatabase = [];
let nextId = 1;

class KarteRecord {
  static async save(karteData) {
    // 実際には患者IDなども含めて保存する
    const newEntry = { id: nextId++, ...karteData, savedAt: new Date() };
    mockDatabase.push(newEntry);
    console.log('Saved to mock DB (Karte):', newEntry);
    return newEntry;
  }
}

module.exports = KarteRecord;