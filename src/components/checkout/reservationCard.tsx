import type { CrearReservaDTO } from "../../types/reservaTypes";
import type { profilesService } from "../../types/serviceTypes";
import { formatFecha, formatRangoHora } from "../../utils/formatFechas";

interface Props {
    servicio: profilesService;
    reserva: CrearReservaDTO;
}

export default function CheckoutReservationCard({ servicio, reserva }: Props) {
    return (
        <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ margin: "0 0 0.8rem 0", fontSize: "1.15rem", fontWeight: 700 }}>Tu reserva</h2>
            <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "1rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>{servicio.titulo}</p>
                <p style={{ margin: 0, color: "#6b7280" }}>{servicio.proveedor.usuario.nombre} {servicio.proveedor.usuario.apellido}</p>
                <p style={{ margin: 0, color: "#6b7280" }}>{formatFecha(reserva.fechaReserva)}</p>
                <p style={{ margin: 0, color: "#6b7280" }}>{formatRangoHora(reserva.rangoTiempoReservado)}</p>
            </div>
        </section>
    );
}