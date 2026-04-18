import type { ProfileProveedor } from "./userTypes";

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
    proveedorId: string;
}

export interface profilesService extends Service {
    proveedor: ProfileProveedor;
}