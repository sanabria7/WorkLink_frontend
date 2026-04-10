import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/authProvider";

interface rolRouteProps {
    requiredRol: string;
}

export default function RolRoute({ requiredRol }: rolRouteProps) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) return <Navigate to="/" replace state={{ from: location.pathname + location.search }} />;

    if (user?.rol !== requiredRol) return <Navigate to="/" replace />;

    return <Outlet />;
}