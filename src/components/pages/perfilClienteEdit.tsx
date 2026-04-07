import { useCallback } from "react";
import { useAuth } from "../../auth/authProvider";
import { useProfile } from "../../hooks/usePerfil";
import type { ProfileCliente } from "../../types/types";
import PerfilUsuario from "./perfilGeneralUsuario";

export default function EditPerfilCliente() {
  const { user } = useAuth();
  const { cliente, rolActivo, setCliente, saveCliente, loading, saving, error } = useProfile(user);

  if (loading) return <p>Cargando perfil...</p>;
  if (rolActivo !== "cliente" || !cliente) return <p>No se encontró el perfil del cliente</p>;

  // Actualiza solo el bloque usuario dentro del perfil cliente
  const handleUsuarioChange = useCallback(
    (partialUser: Partial<ProfileCliente["usuario"]>) => {
      setCliente((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          usuario: {
            ...prev.usuario,
            ...partialUser,
          },
        };
      });
    },
    [setCliente]
  );

  // Actualiza campos específicos del cliente
  const handleFieldChange = useCallback(
    (field: keyof ProfileCliente, value: any) => {
      setCliente((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [field]: value,
        } as ProfileCliente;
      });
    },
    [setCliente]
  );

  // Guardar cambios en BD
  async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!cliente) return;
    try {
      await saveCliente(cliente);
      alert("Perfil guardado correctamente.");
    } catch (error) {
      console.error("Error guardando perfil cliente:", error);
    }
  }

  return (
    <form className="edit-form" onSubmit={handleSubmit} aria-label="Editar perfil" aria-describedby="editPerfil-error">
      <h1>Editar perfil {user?.rol}</h1>
      {error && (
        <div id="editPerfil-error" role="alert" className="errorMessage">
          Error cargando perfil: {String(error)}
        </div>
      )}
      <PerfilUsuario
        usuario={cliente.usuario}
        onChange={handleUsuarioChange}
        disabled={saving}
      />
      <fieldset className="fieldset" aria-label="Perfil cliente">
        <label htmlFor="cliente-ocupacion">Ocupación:</label>
        <input
          id="cliente-ocupacion"
          type="text"
          value={cliente.ocupacion}
          onChange={(evento) => handleFieldChange("ocupacion", evento.target.value)}
          disabled={saving}
        />
        <label htmlFor="cliente-verificado">Verificado:</label>
        <input
          id="cliente-verificado"
          type="checkbox"
          checked={cliente.verificado}
          onChange={(evento) => handleFieldChange("verificado", evento.target.checked)}
          disabled={saving}
        />
      </fieldset>
      <button type="submit" disabled={saving} aria-busy={saving}>
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
