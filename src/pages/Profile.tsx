import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div>
        <h2>Profile</h2>
        <p>You’re not logged in.</p>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>
        Logged in as <b>{user.name}</b> ({user.email})
      </p>
      <Link to="/sessions">Mock Interviews</Link>
    </div>
  );
}
