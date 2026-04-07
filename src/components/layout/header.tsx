import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import { useState } from "react";
import SearchBar from "./searchBar";
import Panel from "./panel";
import Icon from "../misc/icon";

export default function Header() {

    const { isAuthenticated, user, logout, cambiarRol } = useAuth();
    console.log("¿Está autenticado?:", isAuthenticated);
    console.log("Usuario actual:", user);
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    /* const menuRef = useRef<HTMLDivElement | null>(null); */
    const logoRoute = !isAuthenticated
        ? "/"
        : user?.rol === "cliente"
            ? "/home"
            : "/dashboard";

    function handleBecomeProvider() {
        /* console.log("Rol actual antes de cambiar:", user?.rol);
        if (isAuthenticated) {
            if (user?.rol === "cliente") {
                cambiarRol("proveedor");
                navigate("/dashboard", { replace: true });
            } else {
                cambiarRol("cliente");
                navigate("/home", { replace: true });
            }
        } else {
            navigate("/login");
        } */
    }

    function handleLogOut() {
        logout();
        navigate("/", { replace: true })
    }

    return (
        <header className="header">
            <nav className="navbar" aria-label="Navegación Principal">
                {/* Logo */}
                <div className="navbar-left">
                    <Link to={logoRoute} className="logo" aria-label="Ir al inicio">WorkLink</Link>
                </div>
                {/* Barra de búsqueda */}
                <div className="navbar-center">
                    {isAuthenticated && user?.rol === "proveedor" ? (
                        <Panel />
                    ) : (
                        <SearchBar />
                    )}
                </div>
                {/* Acciones del usuario */}
                <div style={{ display: "flex" }} className="navbar-right">
                    {isAuthenticated ? (
                        <div datatype="Cambiar rol de usuario" aria-label={"Funcion del cambio de rol"}>
                            <button type="button" onClick={handleBecomeProvider} className="btn-tertiary">
                                <span>Cambiar rol</span>
                            </button>
                        </div>
                    ) : (
                        <div datatype="Iniciar sesión" aria-label={"Iniciar sesión"}>
                            <button type="button" onClick={() => navigate("/login")} className="btn-tertiary">
                                <span>Iniciar sesión</span>
                            </button>
                        </div>
                    )}

                    <div datatype="Cambiar idioma" aria-label="Cambiar idioma" className="btn-quaternary">
                        <button type="button" onClick={() => alert("Español, Inglés, Messi")}>
                            <span><Icon name="language"></Icon></span>
                        </button>
                    </div>
                    <div className="btn-quaternary">
                        <button type="button" onClick={() => setMenuOpen((prevOpen) => !prevOpen)}>
                            <span><Icon name="menu"></Icon></span>
                        </button>
                    </div>
                    {
                        menuOpen && (
                            <ul id="user-menu" className="dropdown" role="menu">
                                {
                                    !isAuthenticated ? (
                                        <>
                                            <li><Link to="" onClick={() => setMenuOpen(false)}>Centro de ayuda</Link></li>
                                            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Conviértete en proveedor</Link></li>
                                        </>
                                    ) : (
                                        <>
                                            {/* <li>
                                                {user?.nombre ? `${user.nombre} ${user.apellido}` : ""}
                                            </li> */}
                                            <li>
                                                <Link to="/perfil" onClick={() => setMenuOpen(false)}>
                                                    Perfil
                                                </Link>
                                            </li>
                                            <li>
                                                <button type="button" onClick={() => { setMenuOpen(false); handleLogOut(); }} className="btn-quaternary">Cerrar Sesión</button>
                                            </li>
                                        </>
                                    )
                                }
                            </ul>
                        )
                    }
                </div>
            </nav>
        </header>
    );
}