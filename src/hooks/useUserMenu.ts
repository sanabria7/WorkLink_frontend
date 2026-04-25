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
        const base = [
            { label: "Perfil", action: () => navigate("/perfil") },
            { label: "Cerrar sesión", action: handleLogOut },
        ];

        if (role === "cliente") {
            return [
                { label: "Mis reservas", action: () => navigate("/mis-reservas"), icon: "calendar" },
                { label: "Mis pagos", action: () => navigate("/mis-pagos") },
                ...base,
            ];
        } else if (role === "proveedor") {
            return [
                { label: "Crear servicio", action: () => navigate("/crear-servicio") },
                { label: "Gestionar pagos", action: () => navigate("/gestionar-pagos") },
                ...base,
            ];
        }

        return [];
    }, [role, navigate, handleLogOut]);
}