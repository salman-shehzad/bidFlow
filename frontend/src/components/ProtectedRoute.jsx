import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user.role) && user.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
