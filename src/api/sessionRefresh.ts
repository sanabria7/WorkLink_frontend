import axios from "axios";

// Evento global: se dispara cuando el refresh falla (refresh vencido, revocado o
// ausente). authProvider lo escucha y deja la sesión en "deslogueado" sin llamar
// a /logout: el servidor ya borró ambas cookies en esa misma respuesta 401.
export const EVENTO_SESION_EXPIRADA = "sesion-expirada";

const URL_REFRESH = import.meta.env.VITE_API_AUTH_URL + "/refresh";

// Instancia SIN interceptores a propósito: si /refresh responde 401, no debe
// intentar refrescarse a sí misma (bucle infinito).
const clienteRefresh = axios.create({
    withCredentials: true,           // adjunta la cookie refreshToken (Path=/auth/refresh)
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
});

// Deduplicación: si 5 requests fallan con 401 a la vez, todos esperan ESTE
// mismo refresh en vez de disparar 5. Con rotación esto es obligatorio: el
// segundo refresh llegaría con un token ya revocado y el backend, al verlo
// reusado, cerraría todas las sesiones del usuario.
let refrescoEnCurso: Promise<void> | null = null;

export function refrescarSesion(): Promise<void> {
    if (refrescoEnCurso === null) {
        refrescoEnCurso = ejecutarRefresh();
    }
    return refrescoEnCurso;
}

async function ejecutarRefresh(): Promise<void> {
    try {
        await clienteRefresh.post(URL_REFRESH);   // el Set-Cookie renueva ambas cookies
    } catch (error: unknown) {
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
        throw error;
    } finally {
        refrescoEnCurso = null;
    }
}
