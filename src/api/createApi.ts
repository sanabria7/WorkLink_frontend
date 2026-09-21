import axios, { isAxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { refrescarSesion } from "./sessionRefresh";

// La sesión viaja en cookies HttpOnly que el navegador adjunta solo gracias a
// withCredentials. El JS nunca ve el token.
// CSRF: axios lee la cookie XSRF-TOKEN (legible) y la reenvía en el header
// X-XSRF-TOKEN en cada mutación (son sus valores por defecto, aquí explícitos).
//
// Interceptor de respuesta: ante un 401 (accessToken vencido) pide un refresh y
// reintenta el request original UNA vez. Todas las instancias (auth, profiles,
// offers, bookings, payments) lo heredan porque nacen de esta fábrica.

// Bandera propia sobre la config de axios para no reintentar dos veces el mismo request.
interface ConfigConReintento extends InternalAxiosRequestConfig {
    _reintentado?: boolean;
}

// Rutas cuyo 401 significa otra cosa (credenciales malas / refresh vencido) y
// nunca deben disparar un refresh.
function esRutaDeSesion(url: string): boolean {
    return url.endsWith("/login") || url.endsWith("/refresh") || url.endsWith("/logout");
}

export function createApi(baseURL: string): AxiosInstance {

    if (!baseURL) {
        throw new Error("createApi: baseURL no definida (revisa tu archivo .env)");
    }

    const api = axios.create({
        baseURL,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
    });

    function devolverRespuesta(respuesta: AxiosResponse): AxiosResponse {
        return respuesta;
    }

    async function manejarError(error: unknown): Promise<AxiosResponse> {
        if (!isAxiosError(error) || error.response === undefined || error.config === undefined) {
            throw error;
        }
        if (error.response.status !== 401) {
            throw error;
        }

        const config = error.config as ConfigConReintento;
        if (config._reintentado === true || esRutaDeSesion(config.url ?? "")) {
            throw error;
        }

        config._reintentado = true;
        // Si el refresh falla, lanza y el error llega al caller como un 401 normal;
        // sessionRefresh ya avisó a authProvider por el evento "sesion-expirada".
        await refrescarSesion();
        return api(config);
    }

    api.interceptors.response.use(devolverRespuesta, manejarError);

    return api;
}
