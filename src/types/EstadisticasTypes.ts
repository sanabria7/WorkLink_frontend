export interface EstadisticasType{
    porcentajePorServicio: Record<string, number>;
    porcentajePorEstado: Record<string, number>;
    totalReservas: number;
    totalDineroGenerado: number;
}