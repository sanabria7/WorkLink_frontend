import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/authProvider";

export default function NavLeft() {
  const {isAuthenticated, user} = useAuth();
  const logoRoute = !isAuthenticated
    ? "/"
    : user?.rol === "cliente"
    ? "/home"
    : "/dashboard";

  return (
    <div className="navbar-left">
      <Link to={logoRoute} className="logo" aria-label="Ir al inicio">
        WorkLink
      </Link>
    </div>
  );
}