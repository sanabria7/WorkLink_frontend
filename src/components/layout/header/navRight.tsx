import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Icon from "../../misc/icon";
import { useAuth } from "../../../auth/authProvider";

export default function NavRight() {
  const { isAuthenticated, user, perfilCliente, perfilProveedor, logout, cambiarRol } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null);

  const perfilName =
    user?.rol === "cliente"
      ? `${perfilCliente?.usuario?.nombre ?? ""} ${perfilCliente?.usuario?.apellido ?? ""}`
      : user?.rol === "proveedor"
        ? `${perfilProveedor?.usuario?.nombre ?? ""} ${perfilProveedor?.usuario?.apellido ?? ""}`
        : "";


  async function handleChangeRole() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user?.rol === "cliente") {
      await cambiarRol("proveedor");
      navigate("/dashboard", { replace: true });
    } else if (user?.rol === "proveedor") {
      await cambiarRol("cliente");
      navigate("/home", { replace: true })
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogOut() {
    logout();
    navigate("/");
  }

  return (
    <div style={{ display: "flex" }} className="navbar-right">
      {isAuthenticated ? (
        <div datatype="Cambiar rol de usuario" aria-label="Función del cambio de rol">
          <button type="button" onClick={(handleChangeRole)} className="btn-tertiary">
            <span>{user?.rol === "cliente" ? "Cambiar a proveedor" : "Cambiar a cliente"}</span>
          </button>
        </div>
      ) : (
        <div datatype="Iniciar sesión" aria-label="Iniciar sesión">
          <button type="button" onClick={() => navigate("/login")} className="btn-tertiary">
            <span>Iniciar sesión</span>
          </button>
        </div>
      )}

      <div datatype="Cambiar idioma" aria-label="Cambiar idioma" className="btn-quaternary">
        <button type="button" onClick={() => alert("Español, Inglés, Messi")}>
          <span><Icon name="language" /></span>
        </button>
      </div>

      <div className="btn-quaternary">
        <button type="button" onClick={() => setMenuOpen((prevOpen) => !prevOpen)}>
          <span><Icon name="menu" /></span>
        </button>
      </div>

      {menuOpen && (
        <ul id="user-menu" className="dropdown" role="menu" ref={menuRef}>
          {!isAuthenticated ? (
            <>
              <li><button onClick={() => setMenuOpen(false)}>Centro de ayuda</button></li>
              <li><button onClick={() => { setMenuOpen(false); navigate("/login"); }}>Conviértete en proveedor</button></li>
            </>
          ) : (
            <>
              <li>{perfilName}</li>
              <li><button onClick={() => { setMenuOpen(false); navigate("/perfil"); }}>Perfil</button></li>
              <li><button onClick={() => { setMenuOpen(false); handleLogOut(); }}>Cerrar Sesión</button></li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}