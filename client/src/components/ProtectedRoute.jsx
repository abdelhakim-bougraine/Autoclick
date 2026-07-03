import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken } from "../api/auth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = getStoredToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly) {
    const storedUser = localStorage.getItem("autoclickUser");
    if (!storedUser) {
      return <Navigate to="/login" replace />;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch {
      return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
