import { useContext, createContext, useState, useEffect } from "react";
import * as authService from "../api/authService"
import api from "../api/axios";
import type { User } from "../types/types";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (correo: string, password: string) => Promise<void>;
    registro: (data: Omit<User, "id"> & { password: string }) => Promise<void>;
    logout: () => void;
    cambiarRol: (rol: "cliente" | "proveedor") => Promise<void>;
    setUser: (estadoUser: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        (async () => {
            try {
                const res = await api.get<User>("/user/get");
                setUser(res.data);
                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem("accessToken");
                setUser(null);
                setIsAuthenticated(false);
            }
        })();
    }, []);

    async function login(correo: string, password: string) {
        try {
            const token = await authService.login(correo, password);
            localStorage.setItem("accessToken", token);
            const response = await api.get<User>("/user/get");
            setIsAuthenticated(true);
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem("accessToken")
            setIsAuthenticated(false);
            setUser(null);
            throw error;
        }
    }

    async function registro(data: Omit<User, "id"> & { password: string }) {
        try {
            const newUser = await authService.registro(data);
            console.log("Usuario registrado:", newUser);
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
        }
    }

    async function cambiarRol(rol: "cliente" | "proveedor") {
        if (!user) return;
        try {
            const updateUser = await authService.cambiarRol(rol)
            setUser(updateUser);
        } catch (error) {
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, registro, logout, cambiarRol, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe ser usado dentro de AuthProvider")
    return context;
}