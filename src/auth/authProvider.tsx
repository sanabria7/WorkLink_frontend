import { useContext, createContext, useState, useEffect } from "react";
import { isAxiosError } from "axios";
import * as authService from "../api/authService";
import { EVENTO_SESION_EXPIRADA } from "../api/sessionRefresh";
import type { RegistroResponse } from "../api/authService";
import * as profilesService from "../api/profilesService";
import type { ProfileCliente, ProfileProveedor, ProfilesUser, AuthUser } from "../types/userTypes";

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    perfilCliente: ProfileCliente | null;
    perfilProveedor: ProfileProveedor | null;
    login: (correo: string, password: string) => Promise<AuthUser>;
    registro: (data: Omit<AuthUser, "id"> & { password: string }) => Promise<RegistroResponse>;
    logout: () => Promise<void>;
    setUser?: (estadoUser: AuthUser | null) => void;
    cambiarRol: (newRol: "cliente" | "proveedor") => Promise<void>;
    authLoading: boolean;
}

type DatosUsuario = Pick<AuthUser, "nombre" | "apellido" | "correo" | "telefono">;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function construirPerfilClienteInicial(datos: DatosUsuario): ProfileCliente {
    return {
        usuario: {
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.correo,
            telefono: datos.telefono,
        },
        ocupacion: "",
        ratingPromedio: 0,
        verificado: false,
    };
}

function construirPerfilProveedorInicial(datos: DatosUsuario): ProfileProveedor {
    return {
        usuario: {
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.correo,
            telefono: datos.telefono,
        },
        biografia: "",
        verificado: false,
        horarioDisponibilidad: "",
        ratingPromedio: 0,
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [perfilCliente, setPerfilCliente] = useState<ProfileCliente | null>(null);
    const [perfilProveedor, setPerfilProveedor] = useState<ProfileProveedor | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    async function cargarPerfil(userAuth: AuthUser): Promise<void> {
        if (userAuth.rol === "cliente") {
            setPerfilCliente(await profilesService.getPerfilCliente(userAuth.correo));
        } else if (userAuth.rol === "proveedor") {
            setPerfilProveedor(await profilesService.getPerfilProveedor(userAuth.correo));
        }
    }

    // Al montar preguntamos al servidor "¿quién soy?": si la cookie HttpOnly es
    // válida, /user/get responde 200; si no, 401 y quedamos deslogueados.
    useEffect(function bootstrapSesion() {
        async function cargarSesion(): Promise<void> {
            try {
                const userAuth = await authService.getUser();
                setUser(userAuth);
                setIsAuthenticated(true);
                await cargarPerfil(userAuth);
            } catch {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setAuthLoading(false);
            }
        }
        cargarSesion();
    }, []);

    // El interceptor de createApi intentó /auth/refresh y falló: la sesión murió
    // de verdad (refresh vencido o revocado). El servidor ya borró las cookies en
    // ese 401, así que aquí solo se limpia el estado; ProtectedRoute hace el resto.
    useEffect(function escucharSesionExpirada() {
        function cerrarSesionLocal(): void {
            setIsAuthenticated(false);
            setUser(null);
            setPerfilCliente(null);
            setPerfilProveedor(null);
        }
        window.addEventListener(EVENTO_SESION_EXPIRADA, cerrarSesionLocal);
        return function dejarDeEscuchar(): void {
            window.removeEventListener(EVENTO_SESION_EXPIRADA, cerrarSesionLocal);
        };
    }, []);

    async function login(correo: string, password: string): Promise<AuthUser> {
        try {
            await authService.login(correo, password); // el servidor setea la cookie
            const userAuth = await authService.getUser();
            setIsAuthenticated(true);
            setUser(userAuth);
            await cargarPerfil(userAuth);
            return userAuth;
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            throw error;
        }
    }

    async function registro(data: Omit<AuthUser, "id"> & { password: string }): Promise<RegistroResponse> {
        try {
            const respuesta = await authService.registro(data);

            const userProfile: ProfilesUser = {
                email: data.correo,
                nombre: data.nombre,
                apellido: data.apellido,
                telefono: data.telefono,
            };
            await profilesService.createUser(userProfile);

            if (data.rol === "cliente") {
                await profilesService.createPerfilCliente(construirPerfilClienteInicial(data));
            } else if (data.rol === "proveedor") {
                await profilesService.createPerfilProveedor(construirPerfilProveedorInicial(data));
            }

            setUser(null);
            setIsAuthenticated(false);
            return respuesta;
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            throw error;
        }
    }

    async function logout(): Promise<void> {
        try {
            await authService.logOut(); // el servidor borra la cookie
        } catch (error) {
            console.error("Error en logout:", error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            setPerfilCliente(null);
            setPerfilProveedor(null);
        }
    }

    async function cargarOCrearPerfilCliente(datos: AuthUser): Promise<void> {
        try {
            setPerfilCliente(await profilesService.getPerfilCliente(datos.correo));
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 404) {
                const nuevoPerfil = await profilesService.createPerfilCliente(construirPerfilClienteInicial(datos));
                setPerfilCliente(nuevoPerfil);
                return;
            }
            throw error;
        }
    }

    async function cargarOCrearPerfilProveedor(datos: AuthUser): Promise<void> {
        try {
            setPerfilProveedor(await profilesService.getPerfilProveedor(datos.correo));
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 404) {
                const nuevoPerfil = await profilesService.createPerfilProveedor(construirPerfilProveedorInicial(datos));
                setPerfilProveedor(nuevoPerfil);
                return;
            }
            throw error;
        }
    }

    async function cambiarRol(newRol: "cliente" | "proveedor"): Promise<void> {
        if (!user) return;
        setUser({ ...user, rol: newRol });
        try {
            if (newRol === "cliente") {
                await cargarOCrearPerfilCliente(user);
            } else {
                await cargarOCrearPerfilProveedor(user);
            }
        } catch (error) {
            console.error("Error al cambiar de rol:", error);
        }
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated, user, perfilCliente, perfilProveedor, login, registro, logout, setUser, cambiarRol, authLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe ser usado dentro de AuthProvider");
    return context;
}
