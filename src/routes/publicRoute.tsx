import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider";

export default function PublicRoute() {
  const { isAuthenticated, user, authLoading } = useAuth();

  if (authLoading) return null;

  if (isAuthenticated) {
    if (user?.rol === "cliente") {
      return <Navigate to="/home" replace />;
    } else if (user?.rol === "proveedor") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
