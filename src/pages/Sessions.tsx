import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:4000";

export default function Sessions() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [email, setEmail] = useState("");

    const token = localStorage.getItem("token");

    async function load() {
        const res = await fetch(`${API_URL}/sessions`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(await res.json());
    }
    useEffect(() => {
        load();
    }, []);

    async function createSession() {
        await fetch(`${API_URL}/sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ partnerEmail: email }),
        });

        setEmail("");
        load();
    }

    return (
        <div style={{ padding: 24 }}>
            <h2>Mock Interview</h2>

            <input 
            placeholder="Partner email"
            value ={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        <button onClick={createSession}>Create</button>

        <ul>
            {sessions.map((s) => (
                <li key={s.id}>
                    <Link to={`/sessions/${s.id}`}>Open Session</Link>
                </li>
            ))}
        </ul>
        </div>
    );
}
