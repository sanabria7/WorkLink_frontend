import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Icon from "../../misc/icon";
import { useAuth } from "../../../auth/authProvider";
import { useUserMenu } from "../../../hooks/useUserMenu";

export default function NavRight() {
  const { isAuthenticated, user, perfilCliente, perfilProveedor, logout, cambiarRol } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null);
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

      <div className="btn-quaternary">
        <button type="button" onClick={() => setMenuOpen((prevOpen) => !prevOpen)}>
          <span><Icon name="menu" /></span>
        </button>
      </div>

      {menuOpen && (
        <ul id="user-menu" className="dropdown" role="menu" ref={menuRef}>
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
  );
}