import api from "./axiosProfiles";
import type { EstadosSlots, Horario, HorarioPorRango, HorariosPorFecha, HorasDisp } from "../types/horariosTypes";

/* Proveedor */
export async function hasHorarios(id: string): Promise<boolean> {
    const { data } = await api.get<{ respuesta: boolean }>(`${"/api/horarios/tieneHorarios/"}${id}`);
    return data.respuesta;
}

export async function crearHorarios(payload: Horario) {
    const { data } = await api.post("/api/horarios/crear", payload);
    return data;
}

export async function getAll(id: string) {
    const { data } = await api.get(`${"/api/horarios/getAll/"}${id}`);
    return data;
}

export async function añadirPorRango(payload: HorarioPorRango) {
    const { data } = await api.post("api/horarios/addPorRango", payload);
    return data;
}

export async function updateSlot(payload: EstadosSlots) {
    const { data } = await api.put("api/horarios/actualizar/estado", payload);
    return data;
}

/* Cliente */
export async function getFechasDisponibles(id: string) {
    const { data } = await api.get<string[]>(`${"/api/horarios/getFechas/"}${id}`);
    return data;
}

export async function getHorariosPorFecha(payload: HorariosPorFecha): Promise<HorasDisp[]> {
    const { data } = await api.post<HorasDisp[]>("/api/horarios/getPorFecha", payload);
    return data;
}