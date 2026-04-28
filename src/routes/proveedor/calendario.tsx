import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, getDay, parse, parseISO, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../../auth/authProvider";
import * as horariosService from "../../api/horariosService"
import { useEffect, useState, useCallback } from "react";
import Icon from "../../components/misc/icon";
import { useNavigate } from "react-router-dom";
import type { Evento } from "../../types/horariosTypes";
import SlotDialog from "../../components/modals/slotDialog";
import SlotPersonalizado from "../../components/calendar/slot";
import DetallesReservaDialog from "../../components/calendar/infoReservaDialog";

const locales = { es };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function Calendario() {
    const { perfilProveedor } = useAuth();
    const navigate = useNavigate();
    const [evento, setEvento] = useState<Evento[]>([]);
    const [view, setView] = useState<View>("month");
    const [fecha, setFecha] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
    const [selectedReserva, setSelectedReserva] = useState<string | null>(null);

    const idProveedor = perfilProveedor?.id;

    const cargarHorarios = useCallback(async () => {
        if (!idProveedor) return;
        setLoading(true);
        try {
            const data = await horariosService.getAll(idProveedor);
            console.log("Horarios backend:", data);
            const eventosMap: Evento[] = data.map((item: any) => {
                const fechaBase = parseISO(item.fecha);
                const start = parse(item.horaInicio, "HH:mm:ss", fechaBase);
                const end = parse(item.horaFin, "HH:mm:ss", fechaBase);
                return {
                    id: item.id,
                    title: item.estado,
                    start,
                    end,
                    estado: item.estado,
                    codigoReserva: item.codigoReserva
                };
            });
            setEvento(eventosMap);
        } catch (error) {
            console.error("Error cargando los horarios:", error);
        } finally {
            setLoading(false);
        }
    }, [idProveedor]);

    useEffect(() => {
        cargarHorarios();
    }, [cargarHorarios]);

    async function cambiarEstadoSlot(nuevoEstado: "Disponible" | "Reservado" | "No disponible") {
        if (!selectedEvent) return;

        try {
            await horariosService.updateSlot({ idsSlots: [selectedEvent.id], estado: nuevoEstado });
            setEvento((prev) =>
                prev.map((ev) =>
                    ev.id === selectedEvent.id
                        ? { ...ev, estado: nuevoEstado, title: nuevoEstado }
                        : ev
                ));
            alert(`Slot actualizado a: ${nuevoEstado}`);
            setSelectedEvent(null);
        } catch (error) {
            console.error(error);
            alert("Error al actualizar el slot");
        }
    }

    if (loading) return <p>Cargando Calendario...</p>

    return (
        <div style={{ padding: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <h1 style={{ fontWeight: "bold" }}>Mi Calendario</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button onClick={cargarHorarios}>Actualizar</button>
                    <button onClick={() => navigate("/configurar-horarios")}>Gestionar horarios</button>
                </div>
            </div>
            {evento.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: "5rem", paddingBottom: "5rem", backgroundColor: "#f9fafb", borderRadius: "1.5rem", border: "1px dashed #d1d5db" }}>
                    <Icon name="calendar" />
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                        Aún no tienes horarios configurados
                    </h2>
                    <p style={{ color: "#6b7280", maxWidth: "28rem", margin: "0 auto 2rem auto" }}>
                        Configura tus días y horas de atención para que los clientes puedan reservar tus servicios.
                    </p>
                    <button
                        onClick={() => navigate("/configurar-horarios")}
                        style={{ backgroundColor: "#2563eb", color: "#fff", padding: "1rem 2rem", borderRadius: "1rem", fontSize: "1.125rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", border: "none" }}
                    >
                        <Icon name="add" />
                        Configurar mi disponibilidad
                    </button>
                </div>
            ) : (
                <Calendar
                    localizer={localizer} // le dice al calendario como manejar fechas
                    culture="es" // idioma
                    step={30} // cada cuanto se divide el tiempo
                    timeslots={1} // cada cuantas divisiones por step
                    events={evento} // array de eventos del useEffect
                    startAccessor="start" // indica que propiedad del Evento es la fecha/hora de inicio
                    endAccessor="end" // lo mismo para hora de fin
                    selectable // permite al prov hacer clic en los días para seleccionar
                    date={fecha} // fecha que se muestra actualmente
                    view={view} // vista actual (mes, semana o día)
                    views={{ month: true, week: true, day: true }} // personaliza que opciones ver
                    onView={setView} // cuando el prov cambia de vista (mes -> semana) actualiza estado
                    onNavigate={setFecha} // cuando el prov cambia de mes o semana
                    onSelectSlot={(slotInfo) => { // cuando el prov hace clic en un día vacío, cambia a vista día
                        if (slotInfo.slots.length === 1) {
                            setFecha(slotInfo.start);
                            setView(Views.DAY);
                        }
                    }}
                    onSelectEvent={(event) => {
                        const eventoSeleccionado = event as Evento;
                        if (
                            eventoSeleccionado.estado === "Reservado" && eventoSeleccionado.codigoReserva
                        ) {
                            setSelectedReserva(eventoSeleccionado.codigoReserva);
                            return;
                        }
                        setSelectedEvent(eventoSeleccionado);
                    }}
                    components={{ event: SlotPersonalizado }}
                    eventPropGetter={(event) => {
                        let backgroundColor = "#dcfce7";
                        let border = "#16a34a";
                        let color = "#166534";
                        if (event.estado === "Reservado") { backgroundColor = "#dbeafe"; border = "#2563eb"; color = "#1e3a8a"; }
                        if (event.estado === "No disponible") { backgroundColor = "#fee2e2"; border = "#ef4444"; color = "#991b1b"; }
                        return { style: { backgroundColor, border: `1.5px solid ${border}`, color, fontWeight: "bold", borderRadius: "8px", }, };
                    }}
                    style={{ height: 700 }}
                />
            )}
            <SlotDialog
                evento={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onChangeState={cambiarEstadoSlot}
            />
            <DetallesReservaDialog
                open={!!selectedReserva}
                codigoReserva={selectedReserva ?? undefined}
                onClose={() => setSelectedReserva(null)} />
        </div>
    );
}