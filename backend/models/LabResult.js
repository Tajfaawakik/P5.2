// モックデータ：本来はデータベースから取得する
const mockDatabase = [
  { 
    id: 1, 
    patientId: '12345', 
    testDate: '2025-07-18',
    results: { wbc: 90, rbc: 450, hb: 13.5 }
  },
];
let nextId = 2;

class LabResult {
  static async save(patientId, testDate, results) {
    const newEntry = { id: nextId++, patientId, testDate, results };
    mockDatabase.push(newEntry);
    console.log('Saved to mock DB:', newEntry);
    return newEntry;
  }

  static async findByPatientId(patientId) {
    console.log(`Finding from mock DB by patientId: ${patientId}`);
    return mockDatabase.filter(r => r.patientId === patientId);
  }
}

module.exports = LabResult;