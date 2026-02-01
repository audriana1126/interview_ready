import { useEffect, useState } from "react";

type Question = {
    id: number;
    question: string;
    answer: string;
};

const API_URL = "http://localhost:4000";

export default function Questions() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [questionText, setQuestionText] = useState("");
    const [answerText, setAnswerText] = useState("");

    const token = localStorage.getItem("token");

    async function loadQuestions() {
        const res = await fetch(`$API_URL/questions`, {
            headers: {
                Authorizations: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        setQuestions(data);
    }

    useEffect(() => {
        loadQuestions();
    }, []);

    async function addQuestion() {
        if (!questionText.trim()) return;

        await fetch(`${API_URL}/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                question: questionText,
                answer: answerText,
            }),
        });

        setQuestionText("");
        setAnswerText("");
        loadQuestions();
    }

    async function removeQuestion(id: string) {
        await fetch(`${API_URL}/questions/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        loadQuestions();
    }

    return (
        <div style={{ padding: 24 }}>
            <h2>Interview Questions</h2>

            <input
            placeholder="Question"
            value={questionText}
            onChange={(e) =>setQuestionText(e.target.value)}
            />

            <input 
            placeholder="Answer"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            />

            <button onClick={addQuestion}>Add</button>
            
            <ul>
                {questions.map((q) =>(
                    <li key={q.id}>
                        <strong>{q.question}</strong>
                        <p>{q.answer}</p>
                        <button onClick={() => removeQuestion(q.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
