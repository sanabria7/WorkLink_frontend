import type { CrearReservaDTO } from "../../types/reservaTypes";
import type { profilesService } from "../../types/serviceTypes";
import { formatFecha, formatRangoHora } from "../../utils/formatFechas";

interface Props {
    servicio: profilesService;
    reserva: CrearReservaDTO;
}

export default function CheckoutSideBar({ servicio, reserva }: Props) {

    const comision = Math.round(reserva.precio * 0.1);

    return (
        <aside style={{ position: "sticky", top: "1.25rem", backgroundColor: "white", borderRadius: "28px", border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 6px 24px rgba(0,0,0,0.05)" }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.15rem", fontWeight: 700 }}>Resumen de cobro</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <span style={{ color: "#6b7280" }}>Servicio</span>
                    <strong style={{ textAlign: "right" }}>{servicio.titulo}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <span style={{ color: "#6b7280" }}>Proveedor</span>
                    <strong style={{ textAlign: "right" }}>{servicio.proveedor.usuario.nombre} {servicio.proveedor.usuario.apellido}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <span style={{ color: "#6b7280" }}>Fecha</span>
                    <strong style={{ textAlign: "right" }}>{formatFecha(reserva.fechaReserva)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <span style={{ color: "#6b7280" }}>Horario</span>
                    <strong style={{ textAlign: "right" }}>{formatRangoHora(reserva.rangoTiempoReservado)}</strong>
                </div>

                <div style={{ borderTop: "1px solid #e5e7eb", margin: "0.5rem 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <span style={{ color: "#6b7280" }}>Precio</span>
                    <strong>${reserva.precio.toLocaleString("es-CO")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <span style={{ color: "#6b7280" }}>Comisión WorkLink (10%)</span>
                    <strong>${comision.toLocaleString("es-CO")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "1.05rem" }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <strong>${reserva.precio.toLocaleString("es-CO")}</strong>
                </div>
            </div>
        </aside>
    );
}