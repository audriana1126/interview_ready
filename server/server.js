const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();


app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const JWT_SECRET = "dev_secret_change_me";

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}


let users = [];
let sessions = [];
let questions = [];

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (typeof header !== "string") {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = users.some((u) => u.email === email);
  if (exists) return res.status(409).json({ message: "Email exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = { id: makeId(), name, email, passwordHash };
  users.push(user);

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.json({
    token,
    user: { id: user.id, name, email },
  });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.get("/me", authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

app.post("/sessions", authMiddleware, (req, res) => {
  const { partnerEmail } = req.body;

  const partner = users.find((u) => u.email === partnerEmail);

  if (!partner) {
    return res.status(404).json({ message: "User not found" });
  }

  const session = {
    id: makeId(),
    interviewerId: req.userId,
    intervieweeId: partner.id,
  };

  sessions.push(session);

  res.json(session);
});

app.get("/sessions", authMiddleware, (req, res) => {
  const mine = sessions.filter(
    (s) =>
      s.interviewerId === req.userId ||
      s.intervieweeId === req.userId
  );

  res.json(mine);
});

app.get("/sessions/:id/questions", authMiddleware, (req, res) => {
  const list = questions.filter((q) => q.sessionId === req.params.id);
  res.json(list);
});

app.post("/sessions/:id/questions", authMiddleware, (req, res) => {
  const { question, answer } = req.body;

  const q = {
    id: makeId(),
    sessionId: req.params.id,
    question,
    answer: answer || "",
  };

  questions.push(q);

  res.json(q);
});

app.delete("/questions/:id", authMiddleware, (req, res) => {
  questions = questions.filter((q) => q.id !== req.params.id);
  res.json({ success: true });
});


app.get("/", (req, res) => res.send("API running"));


app.listen(4000, () =>
  console.log("API running on http://localhost:4000")
);
