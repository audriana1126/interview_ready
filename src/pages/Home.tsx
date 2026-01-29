import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import homeScreen from "../assets/homeScreen.png";


 
type Post = {
  id: number;
  title: string;
  body: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<Post[]>("/posts?_limit=5");
        setPosts(res.data);
      } catch {
        setError("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);
  return (
        <main className="landing">   
            <section className="landing__left">
                <h1 className="landing__title">
                    Interview- 
                    <br />
                    Ready
                </h1>

                <p className="landing__subtitle">
                    Boost your confidence the <br />
                    best way we know how
                </p>
                <div className="landing__actions">
                    <Link className="landing__action" to="/login">Login</Link>
                    <Link className="landing__action" to="/register">Register</Link>
                </div>
            </section>
            <section className="landing__right">
                <img className="landing__image" src={homeScreen} alt="Interview Ready" />
            </section>
            <section style={{ marginTop: 32, width: "100%" }}>
                <h2>Latest Posts</h2>


                {isLoading && <p>Loading posts...</p>}
                {error && <p>{error}</p>}


                {!isLoading && !error && (
                    <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
                        {posts.map((p) => (
                            <li key={p.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
                                <b>{p.title}</b>
                                <p>{p.body}</p>
                            </li>
                        ))}
                    </ul>
                    )}
            </section>
        </main>
        )
    }

