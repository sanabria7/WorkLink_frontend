import type { CrearReservaDTO, ReservaDTO, ReservaResponse } from "../types/reservaTypes";
import api from "./axiosReservas";

export async function crearReserva(reserva: CrearReservaDTO): Promise<ReservaResponse> {
    const { data } = await api.post<ReservaResponse>("/api/reservas", reserva);
    return data;
}

export async function cancelarReserva(codigoReserva: string): Promise<ReservaResponse> {
    const { data } = await api.put<ReservaResponse>(`${"/api/reservas/cancelar_reserva/"}${codigoReserva}`);
    return data;
}

export async function getReservaById(idReserva: string): Promise<ReservaResponse> {
    const { data } = await api.get<ReservaResponse>(`${"/api/reservas/"}${idReserva}`);
    return data;
}

export async function getClienteReservaById(idCliente: string): Promise<ReservaDTO[]> {
    const { data } = await api.get<ReservaDTO[]>(`${"/api/reservas/misReservasCliente/"}${idCliente}`);
    return data;
}

export async function getProveedorReservaById(idProveedor: string): Promise<ReservaDTO[]> {
    const { data } = await api.get<ReservaDTO[]>(`${"/api/reservas/misReservasProveedor/"}${idProveedor}`);
    return data;
}