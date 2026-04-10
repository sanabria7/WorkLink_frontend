import { useContext, createContext, useState, useEffect, use } from "react";
import * as authService from "../api/authService";
import * as profilesService from "../api/profilesService";
import type { ProfileCliente, ProfileProveedor, ProfilesUser, AuthUser } from "../types/types";

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    perfilCliente: ProfileCliente | null;
    perfilProveedor: ProfileProveedor | null;
    login: (correo: string, password: string) => Promise<AuthUser>;
    registro: (data: Omit<AuthUser, "id"> & { password: string }) => Promise<void>;
    logout: () => void;
    setUser?: (estadoUser: AuthUser | null) => void;
    cambiarRol: (newRol: "cliente" | "proveedor") => Promise<void>;
    authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [perfilCliente, setPerfilCliente] = useState<ProfileCliente | null>(null);
    const [perfilProveedor, setPerfilProveedor] = useState<ProfileProveedor | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setAuthLoading(false);
            return;
        }
        (async () => {
            try {
                const userAuth = await authService.getUser();
                setUser(userAuth);
                setIsAuthenticated(true);
                if (userAuth.rol === "cliente") {
                    setPerfilCliente(await profilesService.getPerfilCliente(userAuth.correo));
                } else if (userAuth.rol === "proveedor") {
                    setPerfilProveedor(await profilesService.getPerfilProveedor(userAuth.correo));
                }
            } catch {
                localStorage.removeItem("accessToken");
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setAuthLoading(false);
            }
        })();
    }, []);

    async function login(correo: string, password: string): Promise<AuthUser> {
        try {
            const token = await authService.login(correo, password);
            if (!token) {
                throw new Error("No se recibió token en la respuesta del servidor")
            }
            const userAuth = await authService.getUser();
            setIsAuthenticated(true);
            setUser(userAuth);
            if (userAuth.rol === "cliente") {
                const perfilCli = await profilesService.getPerfilCliente(userAuth.correo);
                setPerfilCliente(perfilCli);
            } else if (userAuth.rol === "proveedor") {
                const perfilProv = await profilesService.getPerfilProveedor(userAuth.correo);
                setPerfilProveedor(perfilProv);
            }
            return userAuth;

        } catch (error) {
            localStorage.removeItem("accessToken")
            setIsAuthenticated(false);
            setUser(null);
            throw error;
        }
    }

    async function registro(data: Omit<AuthUser, "id"> & { password: string }) {
        try {
            const userAuth = await authService.registro(data);
            console.log("Usuario registrado en AuthService:", userAuth);

            const userProfile: ProfilesUser = {
                email: data.correo,
                nombre: data.nombre,
                apellido: data.apellido,
                telefono: data.telefono,
            }
            await profilesService.createUser(userProfile);
            console.log("Usuario registrado en ProfileService", userProfile);

            if (data.rol === "cliente") {
                const perfilInicialCliente: ProfileCliente = {
                    usuario: {
                        nombre: data.nombre,
                        apellido: data.apellido,
                        email: data.correo,
                        telefono: data.telefono
                    },
                    ocupacion: "",
                    ratingPromedio: 0,
                    verificado: false,
                };
                await profilesService.createPerfilCliente(perfilInicialCliente);
                console.log("Perfil cliente creado", perfilInicialCliente)
            } else if (data.rol === "proveedor") {
                const perfilInicialProveedor: ProfileProveedor = {
                    usuario: {
                        nombre: data.nombre,
                        apellido: data.apellido,
                        email: data.correo,
                        telefono: data.telefono
                    },
                    biografia: "",
                    verificado: false,
                    horarioDisponibilidad: "",
                    ratingPromedio: 0,
                };
                await profilesService.createPerfilProveedor(perfilInicialProveedor);
                console.log("Perfil proveedor creado", perfilInicialProveedor)
            }

            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            throw error;
        }
    }

    function logout() {
        try {
            authService.logOut();
        } catch (error) {
            console.error("Error en logOut:", error)
        } finally {
            localStorage.removeItem("accessToken")
            setIsAuthenticated(false);
            setUser(null);
            setPerfilCliente(null);
            setPerfilProveedor(null);
        }
    }

    async function cambiarRol(newRol: "cliente" | "proveedor") {
        if (!user) return;
        const setRol = { ...user, rol: newRol }
        setUser(setRol);

        try {
            if (newRol === "cliente") {
                try {
                    const perfilCli = await profilesService.getPerfilCliente(user.correo);
                    setPerfilCliente(perfilCli);
                } catch (err:any) {
                    if (err.response?.status === 404) {
                        const perfilInicialCliente: ProfileCliente = {
                            usuario: {
                                nombre: user.nombre,
                                apellido: user.apellido,
                                email: user.correo,
                                telefono: user.telefono,
                            },
                            ocupacion: "",
                            ratingPromedio: 0,
                            verificado: false,
                        }
                        const nuevoPerfil = await profilesService.createPerfilCliente(perfilInicialCliente);
                        setPerfilCliente(nuevoPerfil);
                    }
                }
            } else if (newRol === "proveedor") {
                try {
                    const perfilProv = await profilesService.getPerfilProveedor(user.correo);
                    setPerfilProveedor(perfilProv);
                } catch (err:any) {
                    if (err.response?.status === 404) {
                        const perfilInicialProveedor: ProfileProveedor = {
                            usuario: {
                                nombre: user.nombre,
                                apellido: user.apellido,
                                email: user.correo,
                                telefono: user.telefono,
                            },
                            biografia: "",
                            verificado: false,
                            horarioDisponibilidad: "",
                            ratingPromedio: 0,
                        };
                        const nuevoPerfil = await profilesService.createPerfilProveedor(perfilInicialProveedor);
                        setPerfilProveedor(nuevoPerfil);
                    }
                }
            }
        } catch (error) {
            
        }        
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated, user, perfilCliente, perfilProveedor, login, registro, logout, setUser, cambiarRol, authLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe ser usado dentro de AuthProvider")
    return context;
}