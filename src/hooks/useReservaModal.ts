import { useCallback, useEffect, useMemo, useState } from "react";

import { format, parseISO } from "date-fns";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/authProvider";

import * as horariosService from "../api/horariosService";

import type { profilesService } from "../types/serviceTypes";

import type { HorasDisp } from "../types/horariosTypes";

import { filterExpiredSlots } from "../utils/reservaModal";

interface UseReservaModalProps {
    open: boolean;
    onClose: () => void;
    servicio: profilesService;
}

export default function useReservaModal({ open, onClose, servicio }: UseReservaModalProps) {
    const { perfilCliente } = useAuth();
    const navigate = useNavigate();
    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
    const [fechasDisp, setFechasDisp] = useState<Date[]>([]);
    const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
    const [horasDisp, setHorasDisp] = useState<HorasDisp[]>([]);
    const [loadingFechas, setLoadingFechas] = useState(false);
    const [loadingHorarios, setLoadingHorarios] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const duracionServicio = Number(servicio?.duracion) || 0;
    const precioServicio = Number(servicio?.precio) || 0;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!open || !servicio?.proveedorId) return;
        const cargarFechas = async () => {
            setLoadingFechas(true);
            setError(null);
            try {
                const fechas = await horariosService.getFechasDisponibles(servicio.proveedorId);
                setFechasDisp(
                    fechas.map((fecha: string) => parseISO(fecha))
                );
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar las fechas.");
            } finally {
                setLoadingFechas(false);
            }
        };
        cargarFechas();
    }, [open, servicio?.proveedorId]);

    useEffect(() => {
        if (!fechaSeleccionada || !servicio?.proveedorId) return;
        const cargarHorarios = async () => {
            setLoadingHorarios(true);
            setError(null);
            try {
                const payload = {
                    fecha: format(fechaSeleccionada, "yyyy-MM-dd"),
                    idProveedor: servicio.proveedorId,
                    duracionServ: duracionServicio
                };
                const horarios = await horariosService.getHorariosPorFecha(payload);
                const horariosOrdenados = [...horarios].sort((a, b) =>
                    a.horaInicio.localeCompare(b.horaInicio)
                );
                setHorasDisp(horariosOrdenados);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los horarios.");
                setHorasDisp([]);
            } finally {
                setLoadingHorarios(false);
            }
        };
        cargarHorarios();
    }, [fechaSeleccionada, servicio?.proveedorId, duracionServicio]);

    const horasVisibles = useMemo(() => {
        if (!fechaSeleccionada) return [];
        return filterExpiredSlots({
            fechaSeleccionada,
            horasDisp,
            currentTime,
            duracionServicio,
        });
    }, [fechaSeleccionada, horasDisp, currentTime, duracionServicio]);

    useEffect(() => {
        if (!horaSeleccionada) return;
        const existe = horasVisibles.some(
            slot => slot.horaInicio === horaSeleccionada
        );
        if (!existe) {
            setHoraSeleccionada(null);
        }
    }, [horasVisibles, horaSeleccionada]);

    async function handleReservar() {
        if (!servicio || !fechaSeleccionada || !horaSeleccionada) return;

        if (!perfilCliente?.id) {
            alert("Debes iniciar sesión para hacer una reserva")
            navigate("/login");
            return;
        }

        const slotSeleccionado = horasDisp.find(
            slot => slot.horaInicio === horaSeleccionada
        );

        if (!slotSeleccionado) {
            setError("El horario seleccionado ya no está disponible");
            return;
        };

        const idsSlots = slotSeleccionado.idsSlots
            .split(",")
            .map(id => parseInt(id.trim(), 10))
            .filter(id => !Number.isNaN(id));

        setSubmitting(true);

        try {
            navigate("/checkout", {
                state: {
                    servicio,
                    idsSlots,
                    reserva: {
                        categoriaServicio: servicio.categoria,
                        clienteId: Number(perfilCliente.id),
                        descripcionServicio: servicio.descripcion,
                        duracionServicio: servicio.duracion,
                        modalidad: servicio.modalidad,
                        politicaCancelacion: "Cancela con 24 horas de anticipación",
                        precio: servicio.precio,
                        proveedorId: servicio.proveedorId,
                        rangoTiempoReservado: `${slotSeleccionado.horaInicio} - ${slotSeleccionado.horaFin}`,
                        servicioId: Number(servicio.id),
                        tituloServicio: servicio.titulo,
                        totalPagado: precioServicio,
                        ubicacion: servicio.ubicacion,
                        fechaReserva: format(fechaSeleccionada, "yyyy-MM-dd"),
                        esPagada: false,
                    },
                },
            });
            //handleCloseModal();
        } catch (err) {
            console.error(err);
            setError("No se pudo iniciar la reserva.");
            setSubmitting(false);
        }
    }

    const resetModalState = useCallback(() => {
        setFechaSeleccionada(null);
        setHoraSeleccionada(null);
        setHorasDisp([]);
        //setFechasDisp([]);
        setLoadingFechas(false);
        setLoadingHorarios(false);
        setSubmitting(false);
        setError(null);
    }, []);

    const handleCloseModal = useCallback(() => {
        resetModalState();
        onClose();
    }, [onClose, resetModalState]);

    useEffect(() => {
        setHoraSeleccionada(null);
    }, [fechaSeleccionada]);

    useEffect(() => {
        if (!open) {
            resetModalState();
        }
    }, [open, resetModalState]);

    return {
        fechaSeleccionada,
        setFechaSeleccionada,
        fechasDisp,
        horaSeleccionada,
        setHoraSeleccionada,
        horasVisibles,
        loadingFechas,
        loadingHorarios,
        submitting,
        error,
        duracionServicio,
        precioServicio,
        handleReservar,
        handleCloseModal,
    };
}