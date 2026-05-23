import api from "./axiosPagos";
import type { PagoRequest, PagoResponse } from "../types/pagosTypes";

export async function realizarPago(payload: PagoRequest): Promise<PagoResponse> {
    const { data } = await api.post<PagoResponse>("/api-pagos", payload);
    return data;
}

export async function confirmarPagoConToken(token: string, prestadorID: number): Promise<PagoResponse> {
    const { data } = await api.post<PagoResponse>("/api-pagos/confirmar", null, {
        params: { token, prestadorID },
    });
    return data;
}