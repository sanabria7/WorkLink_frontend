/* Solicitudes HTTP */
export interface AuthResponse {
    body: {
        user: User;
        accesToken: string;
    }
}

export interface AuthErrorResponse{
    body: {
        error: string;
    }
}

export interface User {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
}