export interface AuthResponse {
    body: {
        user: AuthUser;
        accesToken: string;
    }
}

export interface AuthUser {
    id?: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
    rol: string;
}

export interface ProfilesUser {
    email: string;
    nombre: string;
    apellido: string;
    telefono: string;
    fotoPerfilUrl?: string | null;
    fechaNacimiento?: string | null;
}

export interface ClienteDTO {
    id?: string;
    ratingPromedio: number;
    ocupacion: string;
    verificado: boolean;
}

export interface ProveedorDTO {
    id?: string;
    biografia: string;
    verificado: boolean;
    horarioDisponibilidad: string;
    ratingPromedio: number;
}

export interface ProfileCliente extends ClienteDTO {
    usuario: ProfilesUser;
}

export interface ProfileProveedor extends ProveedorDTO {
    usuario: ProfilesUser;
}

export interface Review {
    id?: string;
    calificacion: number;
    comentario: string;
    fechaCreacion?: string;
    clienteId?: string;
    proveedorId?: string;
    idService?: number;
    codigoReserva?: string;
}

export interface Ubicacion {

}