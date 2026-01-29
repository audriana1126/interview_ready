import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
