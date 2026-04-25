import { useEffect, useState } from "react";
import * as reservaService from "../../api/reservasService";
import { useAuth } from "../../auth/authProvider";
import type { ReservaDTO } from "../../types/reservaTypes";
import Icon from "../../components/misc/icon";

export default function MisReservas() {
    const { perfilCliente } = useAuth();
    const [reservas, setReservas] = useState<ReservaDTO[]>([]);
    const [loading, setLoading] = useState(true);

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
        if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return;

        try {
            const response = await reservaService.cancelarReserva(codigoReserva);
            if (response.exito) {
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

    if (loading) {
        return <p style={{ padding: "2rem", textAlign: "center" }}>Cargando tus reservas...</p>;
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" }}>Mis Reservas</h1>

            {reservas.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#f9fafb", borderRadius: "16px" }}>
                    <Icon name="calendar"/>
                    <p style={{ marginTop: "1.5rem", color: "#6b7280", fontSize: "1.1rem" }}>
                        Aún no tienes reservas realizadas
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {reservas.map((reserva) => (
                        <div
                            key={reserva.idReserva}
                            style={{
                                backgroundColor: "white",
                                borderRadius: "16px",
                                padding: "1.5rem",
                                border: "1px solid #e5e7eb",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: "0 0 8px 0", fontWeight: "600" }}>{reserva.tituloServicio}</h3>
                                <p style={{ margin: "4px 0", color: "#6b7280" }}>
                                    {reserva.fechaReserva} • {reserva.rangoTiempoReservado}
                                </p>
                                <p style={{ color: "#6b7280" }}>
                                    {reserva.modalidad} • ${reserva.precio} • {reserva.duracionServicio} min
                                </p>
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <span style={{
                                    display: "inline-block",
                                    padding: "6px 14px",
                                    borderRadius: "9999px",
                                    fontSize: "0.9rem",
                                    fontWeight: "600",
                                    backgroundColor: 
                                        reserva.estadoReserva === "EN_CURSO" ? "#dbeafe" :
                                        reserva.estadoReserva === "CANCELADA" ? "#fee2e2" : "#d1fae5",
                                    color: 
                                        reserva.estadoReserva === "EN_CURSO" ? "#1e40af" :
                                        reserva.estadoReserva === "CANCELADA" ? "#b91c1c" : "#166534"
                                }}>
                                    {reserva.estadoReserva}
                                </span>

                                {reserva.estadoReserva === "EN_CURSO" && (
                                    <button
                                        onClick={() => handleCancelar(reserva.idReserva!)}
                                        style={{
                                            marginTop: "12px",
                                            padding: "8px 16px",
                                            backgroundColor: "#ef4444",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            fontSize: "0.9rem"
                                        }}
                                    >
                                        Cancelar reserva
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}