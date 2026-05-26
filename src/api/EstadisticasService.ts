import api from "./axiosProfiles"
import type { EstadisticasType } from "../types/EstadisticasTypes"

export async function getEstadisticasReservas(proveedorId:string) : Promise<EstadisticasType> {
    const { data } = await api.get(`${"/api/estadisticas/reservas/"}${proveedorId}`)
    return data;
}