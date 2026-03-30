import api from "./axios";
import type { User } from "../types/types";

export async function login(correo: string, password: string) {
    const response = await api.post<{ token: string }>(
        "/login",
        { correo, password }
    );
    const token = response.data.token;
    return token;
}

export async function registro(data: {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    rol: string;
}) {
    const response = await api.post<User>("/user/registrar", data);
    return response.data;
}

export function logOut() {
    localStorage.removeItem("accessToken");
}

export async function cambiarRol(rol: string) {
    const response = await api.post<User>("/user/cambiarRol", { rol });
    return response.data;
}

export async function forgotPassword(correo: string) {
    const response = await api.post<string>("/user/forgot-password", { correo });
    return response.data;
}

export async function resetPassword(playload: { token: string, password: string }) {
    const response = await api.post<string>("user/reset-password", playload);
    return response.data;
}
