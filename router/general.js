const express = require("express");
const axios = require("axios");
const { readBooks } = require("../booksdb");

const router = express.Router();

// Retrieve all books.
router.get("/books", (req, res) => {
  res.json(readBooks());
});

// Retrieve a book by ISBN.
router.get("/books/isbn/:isbn", (req, res) => {
  const book = readBooks()[req.params.isbn];
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Search books by author (case-insensitive, partial match).
router.get("/books/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  const matches = Object.values(readBooks()).filter(book =>
    String(book.author).toLowerCase().includes(author)
  );
  res.json(matches);
});

// Search books by title (case-insensitive, partial match).
router.get("/books/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const matches = Object.values(readBooks()).filter(book =>
    String(book.title).toLowerCase().includes(title)
  );
  res.json(matches);
});

// Retrieve reviews for a specific book.
router.get("/books/:isbn/reviews", (req, res) => {
  const book = readBooks()[req.params.isbn];
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book.reviews || {});
});

// Demonstrates Axios with async/await. The local API routes above are used
// for the assignment; this helper can be called from another Node program.
async function fetchBooksWithAxios(apiBaseUrl = "http://localhost:5000") {
  const response = await axios.get(`${apiBaseUrl}/books`);
  return response.data;
}

module.exports = router;
module.exports.fetchBooksWithAxios = fetchBooksWithAxios;
