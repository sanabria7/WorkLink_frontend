import api from "./axiosProfiles";
import type { ProfileCliente, ProfileProveedor, ProfilesUser } from "../types/types";

/* Crear usuario */
export async function createUser(usuario: ProfilesUser): Promise<ProfilesUser> {
    const { data } = await api.post<ProfilesUser>("/api/usuario", usuario);
    return data;
}

export async function udpatedUser(correo: string, usuario: ProfilesUser): Promise<ProfilesUser> {
    const { data } = await api.put<ProfilesUser>(`${"/api/usuario"}/${correo}`, usuario)
    return data;
}

/* Perfil cliente */
export async function createPerfilCliente(perfil: ProfileCliente): Promise<ProfileCliente> {
    const { data } = await api.post<ProfileCliente>("/api/perfil-cliente", perfil);
    return data;
}

export async function getPerfilCliente(correo: string/* , usuario: ProfilesUser */): Promise<ProfileCliente> {
    const { data } = await api.get<ProfileCliente>(`${"/api/perfil-cliente"}/${correo}`);
    return {
        usuario: data.usuario,
        ocupacion: data.ocupacion ?? "",
        ratingPromedio: data.ratingPromedio ?? 0,
        verificado: data.verificado ?? false,
    };
}

export async function updatePerfilCliente(correo: string, perfil: Partial<ProfileCliente>): Promise<ProfileCliente> {
    const { data } = await api.put<ProfileCliente>(`${"/api/perfil-cliente"}/${correo}`, perfil);
    return data;
}

export async function deletePerfilCliente(correo: string): Promise<void> {
    await api.delete(`${"/api/perfil-cliente"}/${correo}`);
}

/* Perfil proveedor */
export async function createPerfilProveedor(perfil: ProfileProveedor): Promise<ProfileProveedor> {
    const { data } = await api.post<ProfileProveedor>("/api/perfil-servidor", perfil);
    return data;
}

export async function getPerfilProveedor(correo: string/* , usuario: ProfilesUser */): Promise<ProfileProveedor> {
    const { data } = await api.get<ProfileProveedor>(`${"/api/perfil-servidor"}/${correo}`);
    console.log("esta es la data mi rey: ", data);
    return {
        usuario: data.usuario,
        id: data.id,
        biografia: data.biografia ?? "",
        verificado: data.verificado ?? false,
        horarioDisponibilidad: data.horarioDisponibilidad ?? "",
        ratingPromedio: data.ratingPromedio ?? 0,
    };
}

export async function updatePerfilProveedor(correo: string, perfil: Partial<ProfileProveedor>): Promise<ProfileProveedor> {
    const { data } = await api.put<ProfileProveedor>(`${"/api/perfil-servidor"}/${correo}`, perfil);
    return data;
}

export async function deletePerfilProveedor(correo: string): Promise<void> {
    await api.delete(`${"/api/perfil-servidor"}/${correo}`);
}