import api from "./axiosPagos";
import type { TransferenciaPendiente, TransferenciaResponse } from "../types/pagosTypes";

export async function getTransferenciasPendientes(): Promise<TransferenciaPendiente[]> {
    const { data } = await api.get<TransferenciaPendiente[]>("/transferencias/pendientes");
    return data;
}

export async function marcarTransferido(id: string): Promise<void> {
    await api.put(`/transferencias/${id}/transferido`);
}

export async function confirmarPagoConToken(token: string, prestadorID: number): Promise<TransferenciaResponse> {
    const { data } = await api.post<TransferenciaResponse>("/api-pagos/confirmar", null, {
        params: { token, prestadorID },
    });
    return data;
}

export async function obtenerTransferenciasPorProveedor(id:string): Promise<TransferenciaResponse[]> {
    const { data } = await api.get(`/transferencias/proveedor/${id}`);
    return data;
}