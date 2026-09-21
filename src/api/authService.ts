import api from "./axiosAuth";
import type { AuthUser } from "../types/userTypes";

export async function login(correo: string, password: string) {
    await api.post("/login", { correo, password });   // el Set-Cookie hace el resto
}

export interface RegistroResponse {
    mensaje: string;
    correo: string;
    correoEnviado: boolean;   // false si el SMTP falló: la cuenta existe, hay que reenviar
}

export interface ReenvioResponse {
    mensaje: string;
    correoEnviado: boolean;
}

export async function registro(
    data: {
        nombre: string;
        apellido: string;
        correo: string;
        password: string;
        telefono: string;
        rol: string;
    }
): Promise<RegistroResponse> {
    const response = await api.post<RegistroResponse>("/user/registrar", data);
    return response.data;
}

export async function reenviarVerificacion(correo: string): Promise<ReenvioResponse> {
    const response = await api.post<ReenvioResponse>("/user/reenviar-verificacion", { correo });
    return response.data;
}

export async function verificarCuenta(token: string): Promise<{ mensaje: string }> {
    const response = await api.get<{ mensaje: string }>("/user/verificar", { params: { token } });
    return response.data;
}

export function logOut() {
    return api.post("/logout");   // el Set-Cookie hace el resto
}

export async function getUser() {
    const response = await api.get<AuthUser>("/user/me");
    return response.data;
}

export async function forgotPassword(correo: string) {
    const response = await api.post<string>("/user/forgot-password", { correo });
    return response.data;
}

export async function resetPassword(
    playload: { token: string, password: string }
) {
    const response = await api.post<string>("user/new-password", playload);
    return response.data;
}
