import { useEffect, useState } from "react";
import type { profilesService } from "../../types/serviceTypes";
import * as horariosService from "../../api/horariosService";
import * as reservaService from "../../api/reservasService"
import { format, isSameDay, parseISO } from "date-fns";
import { useAuth } from "../../auth/authProvider";
import { useNavigate } from "react-router-dom";
import Icon from "../misc/icon";
import { Dialog } from "@headlessui/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import type { HorasDisp } from "../../types/horariosTypes";
import type { CrearReservaDTO } from "../../types/reservaTypes";

interface ReservaModalProps {
    open: boolean;
    onClose: () => void;
    servicio: profilesService;
}

export default function ReservaModal({ open, onClose, servicio }: ReservaModalProps) {
    const { perfilCliente, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
    const [fechasDisp, setFechasDisp] = useState<Date[]>([]);
    const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
    const [horasDisp, setHorasDisp] = useState<HorasDisp[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !servicio.proveedorId) return;

        const cargarFechas = async () => {
            try {
                const fechas = await horariosService.getFechasDisponibles(servicio.proveedorId);
                const fechasDate = fechas.map((fecha: string) => parseISO(fecha));
                setFechasDisp(fechasDate);
            } catch (error) {
                console.error("Error cargando las fechas disponibles del proveedor:", error);
            }
        };
        cargarFechas();
    }, [open, servicio.proveedorId]);

    useEffect(() => {
        if (!fechaSeleccionada || !servicio) return;

        const cargarHorarios = async () => {
            setLoading(true);
            try {
                const payload = {
                    fecha: format(fechaSeleccionada, "yyyy-MM-dd"),
                    idProveedor: servicio.proveedorId,
                    duracionServ: servicio.duracion
                };
                const horarios = await horariosService.getHorariosPorFecha(payload);
                setHorasDisp(horarios);
            } catch (error) {
                console.error("Error cargando los horarios disponibles del proveedor:", error)
            } finally {
                setLoading(false);
            }
        };
        cargarHorarios();
    }, [fechaSeleccionada, servicio])

    async function handleReservar() {
        if (!isAuthenticated || !perfilCliente?.id) {
            navigate("/login", { replace: true });
            return;
        }
        if (!horaSeleccionada || !fechaSeleccionada) return;

        const slotSeleccionado = horasDisp.find(slot => slot.horaInicio === horaSeleccionada);
        if (!slotSeleccionado) return console.log("No se encontró el slot seleccionado");

        try {
            const reservaInicial: CrearReservaDTO = {
                rangoTiempoReservado: horaSeleccionada,
                fechaReserva: format(fechaSeleccionada, "yyyy-MM-dd"),
                duracionServicio: servicio.duracion,
                precio: servicio.precio,
                totalPagado: servicio.precio,
                clienteId: perfilCliente.id,
                proveedorId: servicio.proveedorId,
                tituloServicio: servicio.titulo,
                descripcionServicio: servicio.descripcion,
                categoriaServicio: servicio.categoria,
                modalidad: servicio.modalidad,
                ubicacion: servicio.ubicacion,
                politicaCancelacion: "Cancela con 24 horas de anticipación",
                esPagada: true
            }
            const response = await reservaService.crearReserva(reservaInicial);

            if (response.exito) {
                alert("Reserva realizada con éxito");
                try {
                    const idsArray = slotSeleccionado.idsSlots.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                    await horariosService.updateSlot({idsSlots: idsArray, estado: "No disponible"});
                    console.log("Slor actualizado a No disponible");
                } catch (error) {
                    console.error("No se pudo actualizar el slot automáticamente:", error);
                }
                onClose();
            } else {
                alert(response.mensaje || "Error al realizar la reserva")
            }
        } catch (error) {
            console.error("Error al procesar la reserva", error);
        }
    }

    function handleCloseModal() {
        setFechaSeleccionada(null);
        setHoraSeleccionada(null);
        setHorasDisp([]);
        setLoading(false);
        onClose();
    }

    useEffect(() => {
        setHoraSeleccionada(null);
    }, [fechaSeleccionada]);

    return (
        <Dialog open={open} onClose={handleCloseModal} style={{ position: "fixed", inset: 0, zIndex: 50 }}>
            <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
                <div style={{ backgroundColor: "white", borderRadius: "24px", maxWidth: "64rem", width: "100%", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {/* Header */}
                    <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Reservar • {servicio?.titulo}</h2>
                        <button onClick={handleCloseModal} style={{ color: "#6b7280", cursor: "pointer" }}>
                            <Icon name="close" />
                        </button>
                    </div>
                    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                        {/* Calendario de fechas */}
                        <div style={{ width: "50%", borderRight: "1px solid #e5e7eb", padding: "1.5rem", overflow: "auto" }}>
                            <h3 style={{ fontWeight: "500", marginBottom: "1rem" }}>Selecciona una fecha</h3>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DateCalendar
                                    value={fechaSeleccionada}
                                    onChange={setFechaSeleccionada}
                                    showDaysOutsideCurrentMonth
                                    fixedWeekNumber={6}
                                    disablePast
                                    minDate={new Date()}
                                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2))}
                                    views={["year", "month", "day"]}
                                    openTo="day"
                                    shouldDisableDate={(date) =>
                                        !fechasDisp.some((f) => isSameDay(f, date))
                                    }
                                    slotProps={{
                                        day: {
                                            sx: {
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    backgroundColor: "#bfdbfe !important",
                                                },
                                                "&.Mui-selected:hover": {
                                                    backgroundColor: "#1d4ed8 !important",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                        {/* Horarios disponibles */}
                        <div style={{ width: "50%", padding: "1.5rem", overflow: "auto" }}>
                            <h3 style={{ fontWeight: "500", marginBottom: "1rem" }}>
                                {fechaSeleccionada
                                    ? `Horarios disponibles • ${format(fechaSeleccionada, "dd MMM yyyy")}`
                                    : "Selecciona una fecha primero"}
                            </h3>
                            {loading ? (
                                <p>Cargando horarios...</p>
                            ) : horasDisp.length > 0 ? (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                                    {horasDisp.map((slot, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setHoraSeleccionada(horaSeleccionada === slot.horaInicio ? null : slot.horaInicio)}
                                            style={{
                                                padding: "1rem",
                                                borderRadius: "16px",
                                                textAlign: "center",
                                                border: horaSeleccionada === slot.horaInicio ? "2px solid #2563eb" : "1px solid #d1d5db",
                                                backgroundColor: horaSeleccionada === slot.horaInicio ? "#eff6ff" : "white",
                                                fontWeight: horaSeleccionada === slot.horaInicio ? 500 : 400,
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                            }}
                                        >
                                            {
                                                format(new Date(`1970-01-01T${slot.horaInicio}`), "hh:mm a").replace("AM", "a. m.").replace("PM", "p. m.")
                                            }
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: "#6b7280" }}>No hay horarios disponibles para esta fecha.</p>
                            )}
                        </div>
                    </div>
                    <div style={{ borderTop: "1px solid #e5e7eb", padding: "1.5rem", display: "flex", justifyContent: "end" }}>
                        <button
                            onClick={handleReservar}
                            disabled={!horaSeleccionada}
                            style={{
                                width: "fit-content",
                                fontSize: "1rem",
                                border: "none",
                                padding: "12px",
                                backgroundColor: horaSeleccionada ? "#2563eb" : "#d1d5db",
                                color: horaSeleccionada ? "white" : "#9ca3af",
                                borderRadius: "10px",
                                fontWeight: "600",
                                cursor: horaSeleccionada ? "pointer" : "not-allowed",
                            }}
                        >
                            Reservar ahora
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}