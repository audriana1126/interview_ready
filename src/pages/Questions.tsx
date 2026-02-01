import { useEffect, useState } from "react";

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
        const saved = localStorage.getItem("questions");
        if (saved) setQuestions(JSON.parse(saved));
    }, []);

    //save whenever questions change
    useEffect(() => {
        localStorage.setItem("questions", JSON.stringify(questions));
    }, [questions]);

    function addQuestion() {
        if (!questionText) return;

        setQuestions([
            ...questions,
            {
                id: Date.now(),
                question: questionText,
                answer: answerText,
            },
        ]);

        setQuestionText("");
        setAnswerText("");
    }

    function removeQuestion(id: number) {
        setQuestions(questions.filter((q) => q.id !== id));
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
            onChange={(e) => setQuestionText(e.target.value)}
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
