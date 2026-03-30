import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import { useState } from "react";

export default function Header() {

    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    /* const menuRef = useRef<HTMLDivElement | null>(null); */

    function handleSearch(evento: React.SubmitEvent<HTMLFormElement>): void {
        evento.preventDefault();
    }

    function handleBecomeProvider() {
        if (isAuthenticated) {
            alert("cambiaste a "+ user?.rol);
        } else {
            navigate("/login");
        }
    }

    function handleLogOut() {
        logout();
        navigate("/", { replace: true })
    }

    return (
        <header className="header">
            <nav style={{ display: "flex" }} className="navbar" aria-label="Navegación Principal">
                {/* Logo */}
                <div className="navbar-left">
                    <Link to="/" className="logo" aria-label="Ir al inicio">WorkLink</Link>
                </div>
                {/* Barra de búsqueda */}
                <div className="navbar-center">
                    <form onSubmit={handleSearch} role="search" aria-label="Formulario de búsqueda">
                        <button type="button" className="btn-searchbar" datatype="location" aria-label="Agregar ubicación">
                            <span>Agregar ubicación</span>
                        </button>
                        <button type="button" className="btn-searchbar" datatype="date-time" aria-label="Agregar fecha">
                            <span>Agregar fecha</span>
                        </button>
                        <button type="button" className="btn-searchbar" datatype="add-service" aria-label="Agregar servicio">
                            <span>Agregar servicio</span>
                        </button>
                        <button type="submit" className="btn-primary" datatype="submit" aria-label="Buscar">
                            <span>Buscar◘</span>
                        </button>
                    </form>
                </div>
                {/* Acciones del usuario */}
                <div style={{ display: "flex" }} className="navbar-right">
                    <div datatype="Cambiar rol de usuario" aria-label={"Funcion del cambio de rol"}>
                        <button type="button" onClick={handleBecomeProvider} className="btn-tertiary">
                            <span>Conviértete en Proveedor</span>
                        </button>
                    </div>
                    <div datatype="Cambiar idioma" aria-label="Cambiar idioma">
                        <button type="button" onClick={() => alert("Español, Inglés, Messi")} className="btn-tertiary">
                            <span>Idioma◘</span>
                        </button>
                    </div>
                    <div className="btn-menu">
                        <button type="button" onClick={() => setMenuOpen((prevOpen) => !prevOpen)}>
                            <span>Menu◘</span>
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
                                            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Iniciar Sesión o registrarse</Link></li>
                                        </>
                                    ) : (
                                        <>
                                            <li><Link to="/perfil" onClick={() => setMenuOpen(false)}>
                                                {user?.nombre ? `${user.nombre} ${user.apellido}` : ""}
                                            </Link>Perfil</li>
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