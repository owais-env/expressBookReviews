const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "books.json");

function readBooks() {
  const raw = fs.readFileSync(DB_PATH, "utf8");
  const rows = JSON.parse(raw);
  return Object.fromEntries(rows.map(book => [String(book.isbn), book]));
}

function writeBooks(books) {
  fs.writeFileSync(DB_PATH, JSON.stringify(Object.values(books), null, 2) + "\n");
}

module.exports = { readBooks, writeBooks };
