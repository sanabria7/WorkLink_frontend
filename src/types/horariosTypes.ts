export interface HorasDisp {
    horaInicio: string;
    horaFin: string;
    idsSlots: string;
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
    estado: "Disponible" | "No disponible";
}

export interface Evento {
    id: number;
    title: string;
    start: Date;
    end: Date;
    estado: "Disponible" | "No disponible";
}