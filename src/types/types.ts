/* Solicitudes HTTP */
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
    rating_promedio: number;
    ocupacion: string;
    verificado: boolean;
}

export interface ProveedorDTO {
    id?: string;
    biografia: string;
    verificado: boolean;
    horario_disponibilidad: string;
    rating_promedio: number;
}

export interface ProfileCliente extends ClienteDTO {
    usuario: ProfilesUser;
    /* reviews?: Review[]; */
}

export interface ProfileProveedor extends ProveedorDTO {
    usuario: ProfilesUser;
    /* cedulaUrl?: string;
    certificadoSaludUrl?: string;
    certificadoAntecedentesUrl?: string;
    certificadoInhabilidadesUrl?: string;
    reviews?: Review[]; */
}

export interface Review {
    id?: string;
    calificacion?: string;
    comentario?: string;
    clienteId?: string;
    proveedorId?: string;
}

export interface Ubicacion {

}