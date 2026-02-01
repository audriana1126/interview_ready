import { useEffect, useRef, useState } from "react";

type Question = {
    id: number;
    question: string;
    answer: string;
};

export default function Questions() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [questionText, setQuestionText] = useState("");
    const [answerText, setAnswerText] = useState("");


    // load from local storage
    useEffect(() => {
    try {
      const saved = localStorage.getItem("questions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setQuestions(parsed);
      }
    } catch (err) {
      console.log("Failed to load questions:", err);
    } 
  }, []);

    function addQuestion() {
        if (!questionText.trim()) return;

        const newItem: Question ={
            id: Date.now(),
            question: questionText,
            answer: answerText,
        };

        setQuestions((prev) => {
            const next = [...prev, newItem];
            localStorage.setItem("questions", JSON.stringify(next));
            return next;
        });

        setQuestionText("");
        setAnswerText("");
    }

    function removeQuestion(id: number) {
        setQuestions((prev) => {
            const next = prev.filter((q) => q.id !== id);
            localStorage.setItem("questions", JSON.stringify(next));
            return next;
        });
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
