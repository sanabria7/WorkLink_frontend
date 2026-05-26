import { useEffect, useState } from "react";
import * as reservaService from "../api/reservasService";
import * as profilesService from "../api/profilesService";
import type { ReservaCompleta } from "../types/reservaTypes";

export function useReservaDetalle(open: boolean, codigoReserva?: string) {
    const [loading, setLoading] = useState(false);
    const [reserva, setReserva] = useState<ReservaCompleta | null>(null);

    useEffect(() => {
        if (!open || !codigoReserva) return;

        const cargarReserva = async () => {
            setLoading(true);

            try {
                const response = await reservaService.getReservaById(codigoReserva);

                if (response.exito && response.reservaDTO) {
                    const reserva = response.reservaDTO;
                    const cliente = await profilesService.getPerfilClienteById(reserva.clienteId);
                    setReserva({...reserva, cliente});
                }
            } catch (error) {
                console.error("Error cargando reserva:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarReserva();
    }, [open, codigoReserva]);

    return {
        loading,
        reserva,
    };
}