import { useCallback, useState } from "react";
import { useAuth } from "../../auth/authProvider";
import { useProfile } from "../../hooks/usePerfil";
import type { ProfileProveedor } from "../../types/types";
import PerfilUsuario from "./perfilGeneralUsuario";
import { isAxiosError } from "axios";
import { mapValidationErrors } from "../../utils/mapValidationErrors";
import { mapGlobalErrors } from "../../utils/mapGlobalErrors";
import Icon from "../misc/icon";

export default function EditPerfilProveedor() {
  const { user } = useAuth();
  const { proveedor, rolActivo, setProveedor, saveProveedor, loading, saving, error } = useProfile(user);
  const [errorResponse, setErrorResponse] = useState<Record<string, string>>({})

  if (loading) return <p>Cargando perfil...</p>;
  if (rolActivo !== "proveedor" || !proveedor) return <p>No se encontró el perfil del proveedor</p>;

  // Actualiza solo el bloque usuario dentro del perfil proveedor
  const handleUsuarioChange = useCallback(
    (partialUser: Partial<ProfileProveedor["usuario"]>) => {
      setProveedor((prev) => {
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
    [setProveedor]
  );

  // Actualiza campos específicos del proveedor
  const handleFieldChange = useCallback(
    (field: keyof ProfileProveedor, value: any) => {
      setProveedor((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [field]: value,
        } as ProfileProveedor;
      });
    },
    [setProveedor]
  );

  // Guardar cambios en BD
  async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!proveedor) return;
    try {
      await saveProveedor(proveedor);
      alert("Perfil guardado correctamente.");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400 && typeof error.response.data === "object") {
          setErrorResponse(mapValidationErrors(error.response.data));
        } else {
          setErrorResponse({ general: mapGlobalErrors(error) });
        }
      } else if (error instanceof Error) {
        setErrorResponse({ general: error.message });
      } else {
        setErrorResponse({ general: "Error desconocido" });
      }
    }
  }

  return (
    <form className="edit-form" onSubmit={handleSubmit} aria-label="Editar perfil" aria-describedby="editPerfil-error">
      <h1>Editar perfil {user?.rol}</h1>
      {errorResponse.general && (
        <div id="editPerfil-error" role="alert" className="errorMessage">
          <Icon name="error"/>
          {errorResponse.general}
        </div>
      )}
      <PerfilUsuario
        usuario={proveedor.usuario}
        onChange={handleUsuarioChange}
        disabled={saving}
        errorResponse={errorResponse}
      />
      <fieldset className="fieldset" aria-label="Perfil proveedor">
        <label htmlFor="proveedor-biografia">Biografia:</label>
        <textarea
          id="proveedor-biografia"
          value={proveedor.biografia}
          onChange={(evento) => handleFieldChange("biografia", evento.target.value)}
          disabled={saving}
        />
        <label htmlFor="proveedor-horarioDisponibilidad">Horario de Disponibilidad:</label>
        <input
          id="proveedor-horarioDisponibilidad"
          type="text"
          value={proveedor.horarioDisponibilidad ?? ""}
          onChange={(evento) => handleFieldChange("horarioDisponibilidad", evento.target.value)}
          disabled={saving}
        />
      </fieldset>
      <button type="submit" disabled={saving} aria-busy={saving}>
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
