import type { ReservaDTO } from "./reservaTypes";
import type { profilesService } from "./serviceTypes";

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
    tokenConfirmacion?: string;
}

export interface TransferenciaResponse {
    pagoID?: string;
    banco?: string;
    titular?: string;
    mensaje: string;
    monto?: string;
    tipoCuenta?: string;
    numeroCuenta?: string;
    transferenciaID?: string;
    createdAt: string;
    fechaTransferencia?: string;
    estadoTransferencia?: string;
}

export interface TransferenciaPendiente {
    id: string;
    proveedorID: number;
    pagoID: string;
    monto: number;
    titular: string;
    banco: string;
    tipoCuenta: string;
    numeroCuenta: string;
    documento: string;
    estado: string;
    createdAt: string;
    transferidoAt?: string | null;
}

export interface PaymentSession {
    pago: PagoResponse;
    servicio: profilesService;
    reserva: ReservaDTO;
    idsSlots: number[];
    createdAt: string;
}