import { Dialog } from "@headlessui/react";
import { isSameDay } from "date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import type { profilesService } from "../../../types/serviceTypes";
import { formatHora } from "../../../utils/formatFechas";
import ReservaFooter from "./reservaFooter";
import ReservaEmptyState from "./reservaEmptyState";
import ReservaModalHeader from "./reservaModalHeader";
import useReservaModal from "../../../hooks/useReservaModal";

interface ReservaModalProps {
    open: boolean;
    onClose: () => void;
    servicio: profilesService;
}

export default function ReservaModal({ open, onClose, servicio }: ReservaModalProps) {

    const {
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
    } = useReservaModal({ open, onClose, servicio, });

    return (
        <Dialog open={open} onClose={handleCloseModal} style={{ position: "fixed", inset: 0, zIndex: 50 }}>
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.72)", backdropFilter: "blur(4px)" }} />
            <div style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center", padding: "16px" }}>
                <div style={{ width: "min(1120px, 100%)", maxHeight: "92vh", overflow: "hidden", backgroundColor: "#ffffff", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(15,23,42,0.25)", display: "flex", flexDirection: "column" }}>
                    <ReservaModalHeader
                        servicioTitulo={servicio?.titulo}
                        duracionServicio={duracionServicio}
                        precioServicio={precioServicio}
                        onClose={handleCloseModal}
                    />
                    <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
                        {error && (
                            <div style={{ marginBottom: "16px", padding: "14px", borderRadius: "14px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}>
                                {error}
                            </div>
                        )}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                            <section style={{ border: "1px solid #e2e8f0", borderRadius: "20px", overflow: "hidden" }}>
                                <div style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                                    <h3 style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
                                        Selecciona una fecha
                                    </h3>
                                    <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "0.88rem" }}>
                                        Solo se muestran fechas disponibles.
                                    </p>
                                </div>
                                <div style={{ padding: "10px" }}>
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
                                                !fechasDisp.some((f) =>
                                                    isSameDay(f, date)
                                                )
                                            }
                                            loading={loadingFechas}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </section>
                            <section style={{ border: "1px solid #e2e8f0", borderRadius: "20px", overflow: "hidden" }}>
                                <div style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                                    <h3 style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
                                        Horarios disponibles
                                    </h3>
                                </div>
                                <div style={{ padding: "18px" }}>
                                    {!fechaSeleccionada ? (
                                        <ReservaEmptyState text="Selecciona una fecha para ver horarios." />
                                    ) : loadingHorarios ? (
                                        <ReservaEmptyState text="Cargando horarios..." />
                                    ) : horasVisibles.length > 0 ? (
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "12px" }}>
                                            {horasVisibles.map((slot, index) => {
                                                const activo =
                                                    horaSeleccionada === slot.horaInicio;
                                                return (
                                                    <button
                                                        key={`${slot.horaInicio}-${index}`}
                                                        onClick={() =>
                                                            setHoraSeleccionada(
                                                                activo
                                                                    ? null
                                                                    : slot.horaInicio
                                                            )
                                                        }
                                                        style={{
                                                            padding: "14px 12px",
                                                            borderRadius: "16px",
                                                            border: activo ? "2px solid #2563eb" : "1px solid #d1d5db",
                                                            backgroundColor: activo ? "#eff6ff" : "#ffffff",
                                                            color: "#0f172a",
                                                            fontWeight: activo ? 700 : 500,
                                                            cursor: "pointer",
                                                            transition: "all 0.2s ease",
                                                            boxShadow: activo ? "0 8px 20px rgba(37,99,235,0.12)" : "0 1px 2px rgba(15,23,42,0.05)"
                                                        }}
                                                    >
                                                        <div>
                                                            {formatHora(slot.horaInicio)}
                                                        </div>

                                                        <div style={{ marginTop: "4px", fontSize: "0.78rem", color: "#64748b" }}>
                                                            {formatHora(slot.horaFin)}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <ReservaEmptyState text="No hay horarios disponibles para esta fecha." />
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                    <ReservaFooter
                        disabled={!horaSeleccionada || submitting || loadingHorarios}
                        submitting={submitting}
                        onClose={handleCloseModal}
                        onReservar={handleReservar}
                    />
                </div>
            </div>
        </Dialog>
    );
}