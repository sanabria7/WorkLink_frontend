import { Dialog } from "@headlessui/react";
import Icon from "../misc/icon";
import ReservaInfoCard from "./reservaInfoCard";
import { useReservaDetalle } from "../../hooks/useReservaModal";
import { formatFecha, formatHora } from "../../utils/formatFechas";

interface Props {
    open: boolean;
    codigoReserva?: string;
    onClose: () => void;
}

export default function DetallesReservaDialog({ open, codigoReserva, onClose }: Props) {
    const { loading, reserva } = useReservaDetalle(open, codigoReserva);

    return (
        <Dialog open={open} onClose={onClose} style={{ position: "fixed", inset: 0, zIndex: 60 }}>
            <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.7)" }}>
                <div style={{ width: "100%", maxWidth: "650px", backgroundColor: "white", borderRadius: "24px", overflow: "hidden" }}>
                    <div
                        style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ fontWeight: 700, fontSize: "1.25rem" }}>
                            Detalle de reserva
                        </h2>
                        <button onClick={onClose}>
                            <Icon name="close" />
                        </button>
                    </div>
                    <div style={{ padding: "1.5rem" }}>
                        {loading ? (
                            <p>Cargando reserva...</p>
                        ) : reserva ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                <div style={{ backgroundColor: "#f9fafb", borderRadius: "18px", padding: "1rem", border: "1px solid #e5e7eb" }}>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                                        {reserva.tituloServicio}
                                    </h3>
                                    <p style={{ color: "#6b7280", fontSize: "0.92rem" }}>
                                        {reserva.descripcionServicio}
                                    </p>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <ReservaInfoCard label="Código" value={reserva.idReserva} />
                                    <ReservaInfoCard label="Estado" value={reserva.estadoReserva} />
                                    <ReservaInfoCard label="Cliente" value={`${reserva.cliente?.usuario.nombre} ${reserva.cliente?.usuario.apellido}`} />
                                    <ReservaInfoCard label="Horario" value={formatHora(reserva.rangoTiempoReservado)} />
                                    <ReservaInfoCard label="Fecha" value={formatFecha(reserva.fechaReserva)} />
                                    <ReservaInfoCard label="Categoría" value={reserva.categoriaServicio} />
                                    <ReservaInfoCard label="Modalidad" value={reserva.modalidad} />
                                    <ReservaInfoCard label="Ubicación" value={reserva.ubicacion} />
                                </div>
                            </div>
                        ) : (
                            <p>No se encontró información.</p>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}