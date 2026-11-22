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
    try {
        const response = await axios.get(`${apiBaseUrl}/books`);
        return response.data;
    } catch (error) {
        throw new Error(`Fetching books failed: ${error.message}`);
    }
}



// Retrieve a book by ISBN using Axios
async function fetchBookByISBN(isbn, apiBaseUrl = "http://localhost:5000") {
    try {
        const response = await axios.get(
            `${apiBaseUrl}/books/isbn/${encodeURIComponent(isbn)}`
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Book not found for this ISBN");
        }
        throw new Error(`ISBN lookup failed: ${error.message}`);
    }
}

// Retrieve books by author using Axios
async function fetchBooksByAuthor(author, apiBaseUrl = "http://localhost:5000") {
    try {
        const response = await axios.get(
            `${apiBaseUrl}/books/author/${encodeURIComponent(author)}`
        );
        return response.data;
    } catch (error) {
        throw new Error(`Author lookup failed: ${error.message}`);
    }
}

// Retrieve books by title using Axios
async function fetchBooksByTitle(title, apiBaseUrl = "http://localhost:5000") {
    try {
        const response = await axios.get(
            `${apiBaseUrl}/books/title/${encodeURIComponent(title)}`
        );
        return response.data;
    } catch (error) {
        throw new Error(`Title lookup failed: ${error.message}`);
    }
}

// Export Axios helper functions
module.exports.fetchBookByISBN = fetchBookByISBN;
module.exports.fetchBooksByAuthor = fetchBooksByAuthor;
module.exports.fetchBooksByTitle = fetchBooksByTitle;


module.exports = router;
module.exports.fetchBooksWithAxios = fetchBooksWithAxios;
