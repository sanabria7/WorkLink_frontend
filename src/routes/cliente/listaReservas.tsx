import { useEffect, useState } from "react";
import * as reservaService from "../../api/reservasService";
import * as horariosService from "../../api/horariosService";
import { useAuth } from "../../auth/authProvider";
import type { ReservaDTO } from "../../types/reservaTypes";
import CancelarReservaDialog from "../../components/modals/cancelarReservaModal";
import { formatFecha, formatRangoHora } from "../../utils/formatFechas";

export default function MisReservas() {
    const { perfilCliente } = useAuth();
    const [reservas, setReservas] = useState<ReservaDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [reservaCancelar, setReservaCancelar] = useState<ReservaDTO | null>(null);

    const cargarReservas = async () => {
        if (!perfilCliente?.id) return;
        setLoading(true);
        try {
            const data = await reservaService.getClienteReservaById(perfilCliente.id);
            setReservas(data);
        } catch (error) {
            console.error("Error cargando mis reservas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarReservas();
    }, [perfilCliente?.id]);

    const handleCancelar = async (codigoReserva: string) => {

        try {
            const response = await reservaService.cancelarReserva(codigoReserva);
            if (response.exito) {
                await horariosService.liberarSlotsReserva(codigoReserva);
                alert("Reserva cancelada exitosamente");
                cargarReservas();
            } else {
                alert(response.mensaje || "No se pudo cancelar la reserva");
            }
        } catch (error) {
            console.error(error);
            alert("Error al cancelar la reserva");
        }
    };

    const reservasOrdenadas = [...reservas].sort((a, b) => {
        const horaA = a.rangoTiempoReservado.split(" - ")[0];
        const horaB = b.rangoTiempoReservado.split(" - ")[0];

        const fechaA = new Date(`${a.fechaReserva}T${horaA}`);
        const fechaB = new Date(`${b.fechaReserva}T${horaB}`);

        return fechaA.getTime() - fechaB.getTime();
    });

    function puedeCancelar(reserva: ReservaDTO) {
        const horaInicio = reserva.rangoTiempoReservado.split(" - ")[0];
        const fechaReserva = new Date(`${reserva.fechaReserva}T${horaInicio}`);

        const limiteCancelacion = new Date(fechaReserva);
        limiteCancelacion.setDate(limiteCancelacion.getDate() - 1);

        return new Date() < limiteCancelacion;
    }

    if (loading) {
        return <p style={{ padding: "2rem", textAlign: "center" }}>Cargando tus reservas...</p>;
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1300px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Mis Reservas</h1>
            </div>

            {reservas.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#f9fafb", borderRadius: "20px", border: "1px dashed #d1d5db" }}>
                    <p style={{ color: "#6b7280" }}>Aún no tienes reservas realizadas</p>
                </div>
            ) : (
                <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f9fafb", textAlign: "left" }}>
                                <th style={thStyle}>Servicio</th>
                                <th style={thStyle}>Fecha</th>
                                <th style={thStyle}>Horario</th>
                                <th style={thStyle}>Modalidad</th>
                                <th style={thStyle}>Precio</th>
                                <th style={thStyle}>Estado</th>
                                <th style={thStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasOrdenadas.map((reserva) => {
                                const cancelable = puedeCancelar(reserva);

                                return (
                                    <tr key={reserva.idReserva} style={{ borderTop: "1px solid #f3f4f6" }}>
                                        <td style={tdStyle}>
                                            <div>
                                                <p style={{ fontWeight: 600 }}>{reserva.tituloServicio}</p>
                                                <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>{reserva.categoriaServicio}</p>
                                            </div>
                                        </td>

                                        <td style={tdStyle}>{formatFecha(reserva.fechaReserva)}</td>
                                        <td style={tdStyle}>{formatRangoHora(reserva.rangoTiempoReservado)}</td>
                                        <td style={tdStyle}>{reserva.modalidad}</td>
                                        <td style={tdStyle}>${reserva.precio}</td>

                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: "6px 12px",
                                                borderRadius: "999px",
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                                backgroundColor: reserva.estadoReserva === "EN_CURSO" ? "#dbeafe" : reserva.estadoReserva === "CANCELADA" ? "#fee2e2" : "#dcfce7",
                                                color: reserva.estadoReserva === "EN_CURSO" ? "#1d4ed8" : reserva.estadoReserva === "CANCELADA" ? "#dc2626" : "#15803d"
                                            }}>
                                                {reserva.estadoReserva}
                                            </span>
                                        </td>

                                        <td style={tdStyle}>
                                            {reserva.estadoReserva === "EN_CURSO" && (
                                                <button
                                                    disabled={!cancelable}
                                                    onClick={() => setReservaCancelar(reserva)}
                                                    style={{
                                                        backgroundColor: cancelable ? "#ef4444" : "#d1d5db",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "8px 14px",
                                                        borderRadius: "10px",
                                                        cursor: cancelable ? "pointer" : "not-allowed",
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            <CancelarReservaDialog
                reserva={reservaCancelar}
                onClose={() => setReservaCancelar(null)}
                onConfirm={async () => {
                    if (!reservaCancelar?.idReserva) return;
                    await handleCancelar(reservaCancelar.idReserva);
                    setReservaCancelar(null);
                }}
            />
        </div>
    );
}
const thStyle = {
    padding: "1rem",
    fontSize: "0.85rem",
    color: "#6b7280",
    fontWeight: 600,
};

const tdStyle = {
    padding: "1rem",
};