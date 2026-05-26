import { useMemo } from "react";
import type { NavigateFunction } from "react-router-dom";
import type { IconName } from "../assets/icons/AppIcons";

interface MenuItem {
    label: string;
    action: () => void;
    icon?: IconName;
}

export function useUserMenu(
    role: string | undefined,
    navigate: NavigateFunction,
    handleLogOut: () => void
): MenuItem[] {
    return useMemo(() => {
        const base: MenuItem[] = [
            { label: "Perfil", action: () => navigate("/perfil"), icon:"account" },
            { label: "Cerrar sesión", action: handleLogOut, icon: "logout" },
        ];

        if (role === "cliente") {
            return [                
                ...base,
                { label: "Reservas", action: () => navigate("/mis-reservas"), icon: "calendar" },
                { label: "Pagos", action: () => navigate("/mis-pagos"), icon: "price_quality" },
                { label: "Reseñas", action: () => navigate("/mis-reseñas"), icon: "message" },
            ];
        } else if (role === "proveedor") {
            return [                
                ...base,
                { label: "Crear servicio", action: () => navigate("/crear-servicio"), icon: "add" },
                { label: "Gestionar pagos", action: () => navigate("/gestion-pagos"), icon: "price_quality" },
            ];
        }

        return [];
    }, [role, navigate, handleLogOut]);
}