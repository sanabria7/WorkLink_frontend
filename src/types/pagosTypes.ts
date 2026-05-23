export type MetodoPago = "TARJETA" | "PSE" | "EFECTIVO";

export interface TarjetaRequest {
    tokenTarjeta: string;
    ultimos4: string;
    marcaTarjeta: string;
}

export interface PagoRequest {
    clienteID: number;
    servicioID: number;
    monto: number;
    metodoPago: MetodoPago;
    tarjeta?: TarjetaRequest;
}

export interface PagoResponse {
    pagoID?: string;
    mensaje: string;
    clienteID?: number;
    proveedorID?: number;
    servicioID?: number;
    fechaPago?: string;
    estadoPago?: string;
    metodoPago?: string;
    montoPago?: number;
}