export interface HorasDisp {
    horaInicio: string;
    horaFin: string;
    idsSlots: string;
    codigoReserva?: string;
}

export interface HorariosPorFecha {
    fecha: string;
    idProveedor: string;
    duracionServ: number;
}

export interface Horario {
    diasLaborales: number[];
    horaInicio: string;
    horaFin: string;
    idProveedor: string;
}

export interface HorarioPorRango {
    fechaInicio: string;
    fechaFin: string;
    horaInicio: string;
    horaFin: string;
    idProveedor: string;
}

export interface EstadosSlots {
    idsSlots: number[];
    estado: "Disponible" | "Reservado" | "No disponible";
}

export interface ReservaSlots {
    idsSlots: number[];
    codigoReserva: string;
}

export interface Evento {
    id: number;
    title: string;
    start: Date;
    end: Date;
    estado: "Disponible" | "Reservado" | "No disponible";
    codigoReserva?: string;
}