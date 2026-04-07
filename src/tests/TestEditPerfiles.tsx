import EditPerfilProveedor from "../components/pages/perfilProveedorEdit";
import { useProfile } from "../hooks/usePerfil";
import type { AuthUser } from "../types/types";

export default function EditPerfilProveedorTest() {
  const fakeUser: AuthUser = {
    nombre: "cami",
    apellido: "lo",
    correo: "cam@test.com",
    telefono: "0987654321",
    rol: "proveedor",
  };

  console.log("Componente EditPerfilClienteTest - fakeUser:", fakeUser);

  const { proveedor, loading, error } = useProfile(fakeUser);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error: {String(error)}</p>;
  if (!proveedor) return <p>No se encontró perfil proveedor</p>;

  /* export default function EditPerfilProveedor({ overrideUser }: { overrideUser?: AuthUser }) { //eliminar los argumentos
    const { user: authUser } = useAuth();
    const user = overrideUser ?? authUser; */
  return <EditPerfilProveedor /* overrideUser={fakeUser} *//>;
}