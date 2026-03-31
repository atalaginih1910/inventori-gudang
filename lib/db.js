const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function readData(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function generateId(data) {
  if (data.length === 0) return 1;
  return Math.max(...data.map((item) => item.id)) + 1;
}

module.exports = { readData, writeData, generateId };
