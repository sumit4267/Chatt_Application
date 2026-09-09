import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, checkingSession } = useAuth();

  if (checkingSession) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh", color: "var(--text-muted)" }}>
        Loading…
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
