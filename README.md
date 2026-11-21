# Express Book Review API

A starter implementation of the IBM Express Book Review final project.

## Requirements

- Node.js 18+
- npm

## Run locally

```bash
npm install
npm start
```

The API runs at `http://localhost:5000`.

## Important: use the assignment's provided JSON data

The included `books.json` is only sample data so the project runs immediately. Replace it with the JSON file supplied by your course. The loader expects an array of books with `isbn`, `title`, `author`, and optional `reviews` fields. If your supplied file uses a different structure, adjust `booksdb.js` accordingly.

## API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/books` | All books |
| GET | `/books/isbn/:isbn` | Book by ISBN |
| GET | `/books/author/:author` | Search by author |
| GET | `/books/title/:title` | Search by title |
| GET | `/books/:isbn/reviews` | Reviews for a book |
| POST | `/customer/register` | Register |
| POST | `/customer/login` | Login |
| POST | `/customer/logout` | Logout |
| PUT | `/customer/auth/review/:isbn` | Add/update own review |
| DELETE | `/customer/auth/review/:isbn` | Delete own review |

## cURL evidence commands

Run these in a terminal while the server is running. Use a cookie jar so the session created at login is sent with review requests.

```bash
# Task 2: all books
curl -i http://localhost:5000/books

# Task 3: ISBN
curl -i http://localhost:5000/books/isbn/9780140449136

# Task 4: author
curl -i http://localhost:5000/books/author/Homer

# Task 5: title
curl -i http://localhost:5000/books/title/Odyssey

# Task 6: initial reviews
curl -i http://localhost:5000/books/9780140449136/reviews

# Task 7: register (choose a new username)
curl -i -X POST http://localhost:5000/customer/register \
  -H "Content-Type: application/json" \
  -d '{"username":"owais_demo","password":"pass123"}'

# Task 8: login and save session cookie
curl -i -c cookies.txt -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"owais_demo","password":"pass123"}'

# Task 9: add/update review
curl -i -b cookies.txt -X PUT http://localhost:5000/customer/auth/review/9780140449136 \
  -H "Content-Type: application/json" \
  -d '{"review":"A very enjoyable book."}'

# Task 10: delete review
curl -i -b cookies.txt -X DELETE http://localhost:5000/customer/auth/review/9780140449136
```

Save the complete command and its actual terminal output in the evidence files requested by your course (`getallbooks`, `getbooksbyISBN`, etc.). Do not submit invented or copied sample outputs: capture the output produced by your own running project.

## Task 1: GitHub fork proof

Fork `https://github.com/ibm-developer-skills-network/expressBookReview` into your own GitHub account. Then run:

```bash
curl -L https://api.github.com/repos/YOUR_GITHUB_USERNAME/expressBookReview
```

The JSON response should show the repository's `fork` field as `true` and its parent/source repository. Save the real command and output as `githubrepo`.

## Task 11: general.js GitHub URL

After pushing your work, submit the URL in this form:

`https://github.com/YOUR_GITHUB_USERNAME/expressBookReview/blob/main/router/general.js`

Change `main` if your default branch has a different name.

## Notes

- This is an educational starter, not production-ready authentication. Passwords are stored in memory and in plain text. Use password hashing, persistent storage, HTTPS, and a strong session secret for real deployments.
- The course may require specific route names or function signatures from its starter files. Keep those conventions if the provided grader expects them.
