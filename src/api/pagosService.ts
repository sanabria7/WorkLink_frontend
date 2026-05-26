import api from "./axiosPagos";
import type { PagoRequest, PagoResponse } from "../types/pagosTypes";

export async function realizarPago(payload: PagoRequest): Promise<PagoResponse> {
    const { data } = await api.post<PagoResponse>("/api-pagos", payload);
    return data;
}