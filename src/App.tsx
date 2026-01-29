import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useAuth } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";


export default function App() {
  const { user } = useAuth(); 

  return (
    <div style={{ padding: 24 }}>
      <h1>Interview Ready</h1>

      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>

        <div style={{ marginLeft: "auto" }}>
          {user ? `✅ ${user.name}` : "👤 Guest"}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
      </Routes>

    </div>
  );
}



