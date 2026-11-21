const express = require("express");
const session = require("express-session");
const authRouter = require("./router/auth_users");
const generalRouter = require("./router/general");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "replace-this-secret-before-deployment",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax" }
}));

app.get("/", (_req, res) => {
  res.json({ message: "Express Book Review API is running" });
});

app.use("/customer", authRouter);
app.use("/", generalRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => console.log(`Book Review API listening on port ${PORT}`));
