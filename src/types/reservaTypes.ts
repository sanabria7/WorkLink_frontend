import type { profilesService, Service } from "./serviceTypes";
import type { ClienteDTO, ProfileCliente, ProfileProveedor, ProveedorDTO } from "./userTypes";

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
    servicio?: profilesService;
    cliente?: ProfileCliente;
    proveedor?: ProfileProveedor;    
}

export interface ReservaResponse {
    exito: boolean;
    mensaje: string;
    codigoReserva?: string;
    reservaDTO?: ReservaDTO;
}