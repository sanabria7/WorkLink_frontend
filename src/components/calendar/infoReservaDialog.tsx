import { Dialog } from "@headlessui/react";
import Icon from "../misc/icon";
import { useReservaDetalle } from "../../hooks/useInfoReservaCalendario";
import { formatFecha, formatRangoHora } from "../../utils/formatFechas";

interface Props {
    open: boolean;
    codigoReserva?: string;
    onClose: () => void;
}

export default function DetallesReservaDialog({ open, codigoReserva, onClose }: Props) {
    const { loading, reserva } = useReservaDetalle(open, codigoReserva);

    return (
        <Dialog open={open} onClose={onClose} style={{ position: "fixed", inset: 0, zIndex: 100 }}>
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.75)", padding: "20px" }}>
                <div style={{ backgroundColor: "white", width: "100%", maxWidth: "680px", borderRadius: "28px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                    <div style={{ padding: "1.75rem 2rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 style={{ margin: 0, fontSize: "1.65rem", fontWeight: 700 }}>Detalle de la Reserva</h2>
                        <button onClick={onClose} style={{ width: "42px", height: "42px", borderRadius: "999px", backgroundColor: "#f3f4f6", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "1.4rem" }}>
                            <Icon name="close" />
                        </button>
                    </div>
                    <div style={{ padding: "2rem" }}>
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "3rem" }}>Cargando información de la reserva...</div>
                        ) : reserva ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                                <div>
                                    <h3 style={{ margin: "0", fontSize: "1.45rem", fontWeight: 700 }}>{reserva.tituloServicio}</h3>
                                    <p style={{ color: "#4b5563", lineHeight: "1.55", fontSize: "1.02rem" }}>{reserva.descripcionServicio}</p>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Código</span>
                                            <p style={{ margin: "0.25rem 0 0 0", fontWeight: 700, fontFamily: "monospace", fontSize: "1.02rem" }}>{reserva.idReserva}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Estado</span>
                                        <p style={{ margin: "0.25rem 0 0 0" }}>
                                            <span
                                                style={{
                                                    padding: "4px 14px", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600,
                                                    backgroundColor: reserva.estadoReserva === "EN_CURSO"
                                                        ? "#dbeafe" : reserva.estadoReserva === "CANCELADA"
                                                            ? "#fee2e2" : "#dcfce7", color: reserva.estadoReserva === "EN_CURSO"
                                                                ? "#1d4ed8" : reserva.estadoReserva === "CANCELADA" ? "#dc2626" : "#15803d"
                                                }}>
                                                {reserva.estadoReserva}
                                            </span>
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div><span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Fecha</span><p style={{ margin: "0.25rem 0 0 0", fontWeight: 600 }}>{formatFecha(reserva.fechaReserva)}</p></div>
                                        <div><span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Horario</span><p style={{ margin: "0.25rem 0 0 0", fontWeight: 600 }}>{formatRangoHora(reserva.rangoTiempoReservado)}</p></div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div><span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Modalidad</span><p style={{ margin: "0.25rem 0 0 0", fontWeight: 600 }}>{reserva.modalidad}</p></div>
                                    </div>
                                    <div>
                                        <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Categoría</span>
                                        <p style={{ margin: "0.25rem 0 0 0", fontWeight: 600 }}>{reserva.categoriaServicio}</p>
                                    </div>
                                    <div >
                                        <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Ubicación</span>
                                        <p style={{ margin: "0.25rem 0 0 0", fontWeight: 600 }}>{reserva.ubicacion}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Cliente</span>
                                        <p style={{ margin: "0.25rem 0 0 0", fontWeight: 600 }}>
                                            {reserva.cliente?.usuario?.nombre.toUpperCase()} {reserva.cliente?.usuario?.apellido.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "3rem" }}>No se encontró información de esta reserva.</div>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}