import type { ProveedorDTO } from "./types";

export type Categoria = "Arte" | "Educacion" | "Eventos";

export interface Service {
    id?: string;
    titulo: string;
    descripcion: string;
    categoria: Categoria;
    precio: number;
    duracion: number;
    modalidad: "Presencial" | "Online";
    ubicacion: string;
    proveedorId: number | string;
}

export interface profilesService extends Service {
    proveedor: ProveedorDTO;
}