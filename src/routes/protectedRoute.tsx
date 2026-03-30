import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/authProvider";

export default function ProtectedRoute(){
    const auth = useAuth();
    const location = useLocation();

    if(auth.isAuthenticated) return <Outlet />

    return <Navigate to="/login" replace state={{from: location.pathname + location.search}}/>;
}