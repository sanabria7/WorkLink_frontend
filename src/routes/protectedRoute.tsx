import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/authProvider";

export default function ProtectedRoute(){
    const auth = useAuth();
    const location = useLocation();

    if(auth.authLoading) return null;

    return auth.isAuthenticated
     ? <Outlet/>
     : <Navigate to="/" replace state={{from: location.pathname + location.search}}/>;
}