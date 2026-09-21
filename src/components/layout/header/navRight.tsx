import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Icon from "../../misc/icon";
import { useAuth } from "../../../auth/authProvider";
import { useUserMenu } from "../../../hooks/useUserMenu";

export default function NavRight() {
  const { isAuthenticated, user, perfilCliente, perfilProveedor, logout, cambiarRol } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapperRef = useRef<HTMLDivElement | null>(null);
  const menuItems = useUserMenu(user?.rol, navigate, handleLogOut);

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

  // Cierra al hacer clic FUERA del bloque hamburguesa+menú. El wrapper incluye
  // el botón: así el mousedown sobre la hamburguesa no cierra lo que el click
  // acaba de abrir (antes: mousedown cerraba y click reabría -> nunca cerraba).
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuWrapperRef.current && !menuWrapperRef.current.contains(event.target as Node)) {
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

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  return (
    <div style={{ display: "flex" }} className="navbar-right">
      {isAuthenticated && user?.rol ? (
        <div datatype="Cambiar rol de usuario" aria-label="Función del cambio de rol">
          <button type="button" onClick={(handleChangeRole)} className="btn-tertiary">
            <span>{user.rol === "cliente" ? "Cambiar a proveedor" : "Cambiar a cliente"}</span>
          </button>
        </div>
      ) : !isAuthenticated ? (
        <div datatype="Iniciar sesión" aria-label="Iniciar sesión">
          <button type="button" onClick={() => navigate("/login")} className="btn-tertiary">
            <span>Iniciar sesión</span>
          </button>
        </div>
      ) : null}

      <div ref={menuWrapperRef}>
      <div className="btn-quaternary">
        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Abrir menú"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls="user-menu">
          <span><Icon name="menu" /></span>
        </button>
      </div>

      {menuOpen && (
        <ul id="user-menu" className="dropdown" role="menu">
          {!isAuthenticated ? (
            <div>
              <li className="dropdown__item"><button className="dropdown__button" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>Centro de ayuda</button></li>
              <li className="dropdown__item"><button className="dropdown__button" onClick={() => { setMenuOpen(false); navigate("/login"); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>Conviértete en proveedor</button></li>
            </div>
          ) : (
            <>
              {/* NOMBRE */}
              <div className="dropdown__header">
                <li className="name">{perfilName.toUpperCase()}</li>
              </div>
              {/* OPCIONES */}
              <div>
                {menuItems
                  .filter((item) => item.label !== "Cerrar sesión")
                  .map((item) => (
                    <li className="dropdown__item" key={item.label}>
                      <button className="dropdown__button" onClick={() => { setMenuOpen(false); item.action(); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {item.icon && <Icon name={item.icon}></Icon>}
                        {item.label}
                      </button>
                    </li>
                  ))}
              </div>
              {/* LOGOUT */}
              <div className="dropdown__section">
                {menuItems
                  .filter((item) => item.label === "Cerrar sesión")
                  .map((item) => (
                    <li key={item.label} className="dropdown__item">
                      <button
                        className="dropdown__button dropdown__button--danger"
                        onClick={() => { setMenuOpen(false); item.action(); }}>
                        {item.icon && <Icon name={item.icon} />}
                        {item.label}
                      </button>
                    </li>
                  ))}
              </div>
            </>
          )}
        </ul>
      )}
      </div>
    </div>
  );
}