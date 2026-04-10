import { useAuth } from "../../auth/authProvider";
import { useProfile } from "../../hooks/usePerfil";
import EditPerfilCliente from "./perfilClienteEdit";
import EditPerfilProveedor from "./perfilProveedorEdit";

export default function PerfilRedirect() {
  const { user } = useAuth();
  const { rolActivo } = useProfile(user);

  if (!user) return <p>Debes iniciar sesión</p>;

  if (rolActivo === "cliente") {
    return <EditPerfilCliente />;
  }

  if (rolActivo === "proveedor") {
    return <EditPerfilProveedor />;
  }

  return <p>No se encontró un rol válido</p>;
}
