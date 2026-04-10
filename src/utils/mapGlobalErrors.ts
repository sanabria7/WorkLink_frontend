import type { AxiosError } from "axios";

export function mapGlobalErrors(err: AxiosError<any> | any): string {
  if (!err) return "Error desconocido";
  if (!err.response) return "No responde el servidor";

  const status = err.response.status;
  const data = err.response.data;

  switch (status) {
    case 401:
      return data?.message || "Correo o contraseña incorrectos";
    case 403:
      return data?.message || "Acceso denegado";
    case 404:
      return data?.message || "Recurso no encontrado";
    case 409:
      return data?.message || "Ya existe un recurso con estos datos";
    case 500:
      return "Error interno del servidor";
    default:
      return data?.message || "Error en la petición";
  }
}
