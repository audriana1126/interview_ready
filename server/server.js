const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Server works!"));

app.listen(4000, () => console.log("API running on http://localhost:4000"));


let questions = [];

function authMiddleware(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token"});

    try {
        const payload = isJSDocThrowsTag.verify(token, JWT_SECRET);
        req.userID = payload.userID;
        next();
    }   catch {
        res.status(401).json({ message: "Invalid token" });
    }
}

app.get("/questions", authMiddleware, (req, res) => {
    const { question, answer } = req.body;

    const q = {
        id: makeId(),
        userId: req.userId,
        question,
        answer: answer || "",
    };

    questions.push(q);
    res.json(q);
});

app.delete("/questions/:id", authMiddleware, (req, res) => {
    questions = questions.filter((q) => !(q.id === req.params.id && q.userId === req.userId));
    res.json({ success: true });
});

