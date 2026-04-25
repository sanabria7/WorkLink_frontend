import type { Service } from "./serviceTypes";
import type { ClienteDTO, ProveedorDTO } from "./userTypes";

export type estadoReserva = "EN_CURSO" | "CANCELADA" | "COMPLETADA";

export interface CrearReservaDTO {
    rangoTiempoReservado: string;
    politicaCancelacion: string;
    categoriaServicio: string;
    modalidad: "Presencial" | "Online";
    ubicacion: string;
    tituloServicio: string;
    fechaReserva: string;
    descripcionServicio: string;
    duracionServicio: number;
    precio: number;
    totalPagado: number;
    clienteId: string;
    proveedorId: string;
    esPagada: boolean;
}

export interface ReservaDTO extends CrearReservaDTO {
    idReserva?: string;
    estadoReserva: estadoReserva;
}

export interface ReservaCompleta extends ReservaDTO {
    servicio?: Service;
    cliente?: ClienteDTO;
    proveedor?: ProveedorDTO;    
}

export interface ReservaResponse {
    exito: boolean;
    mensaje: string;
    reservaDTO?: ReservaDTO;
}