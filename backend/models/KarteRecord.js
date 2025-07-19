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

  static async findByPatientId(patientId) {
    // 実際にはpatientIdで絞り込む
    console.log(`Finding from mock DB (Karte) by patientId: ${patientId}`);
    return mockDatabase;
  }
}

module.exports = KarteRecord;