import { Link, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useAuth } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";


export default function App() {
  const { user, logout } = useAuth(); 

  return (
    <div style={{ padding: 24 }}>
      <h1>Interview Ready</h1>

      <nav style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <Link to="/">Home</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to ="/register">Register</Link>
          </>
        ) : (
          <>
          <Link to="/profile">Profile</Link>
          <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
          </>
        )}
        
        

        <div style={{ marginLeft: "auto" }}>
          {user ? `${user.name}` : "Guest"}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/profile" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/profile" replace />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}



