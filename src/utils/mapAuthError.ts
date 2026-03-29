import type { AxiosError } from "axios";

export function mapAuthError(err: AxiosError<any> | any): string {
  if (!err) return "Error desconocido";
  if (!err.response) return "No responde el servidor";

  const status = err.response.status;
  const data = err.response.data;

  switch (status) {
    case 400:
      return data?.message || "Datos inválidos";
    case 401:
      return data?.message || "Credenciales inválidas";
    case 403:
      return data?.message || "Acceso denegado";
    case 404:
      return data?.message || "No encontrado";
    case 409:
      return data?.message || "Recurso en conflicto";
    case 500:
      return "Error interno del servidor";
    default:
      return data?.message || data?.body?.error || "Error en la petición";
  }
}
