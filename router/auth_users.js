const express = require("express");
const { readBooks, writeBooks } = require("../booksdb");

const router = express.Router();

// In-memory user store: accounts reset when the server restarts.
// Use a database and hashed passwords for production applications.
const users = Object.create(null);

function requireLogin(req, res, next) {
  if (!req.session.username || !users[req.session.username]) {
    return res.status(401).json({ error: "Please log in first" });
  }
  next();
}

// Register a new account.
router.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  if (users[username]) {
    return res.status(409).json({ error: "User already exists" });
  }
  users[username] = { password };
  res.status(201).json({ message: "User successfully registered. You can now log in." });
});

// Log in an existing account.
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password || !users[username] || users[username].password !== password) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  req.session.username = username;
  res.json({ message: "Login successful", username });
});

// Log out the current account.
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Could not log out" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

// Add or update the logged-in user's review for a book.
router.put("/auth/review/:isbn", requireLogin, (req, res) => {
  const { review } = req.body || {};
  if (typeof review !== "string" || !review.trim()) {
    return res.status(400).json({ error: "A non-empty review is required" });
  }
  const books = readBooks();
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ error: "Book not found" });
  book.reviews = book.reviews || {};
  book.reviews[req.session.username] = review.trim();
  writeBooks(books);
  res.json({ message: "Review added or updated successfully", reviews: book.reviews });
});

// Delete the logged-in user's review.
router.delete("/auth/review/:isbn", requireLogin, (req, res) => {
  const books = readBooks();
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ error: "Book not found" });
  book.reviews = book.reviews || {};
  if (!Object.prototype.hasOwnProperty.call(book.reviews, req.session.username)) {
    return res.status(404).json({ error: "You have not reviewed this book" });
  }
  delete book.reviews[req.session.username];
  writeBooks(books);
  res.json({ message: "Review deleted successfully", reviews: book.reviews });
});

module.exports = router;
