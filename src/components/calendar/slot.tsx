import type { Evento } from "../../types/horariosTypes";

type Props = { event: Evento; };

export default function SlotPersonalizado({ event }: Props) {
    const horaInicio = event.start.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    const horaFin = event.end.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <div style={{ display:"flex", gap:"0.5rem", alignItems:"center", fontSize: "1rem", lineHeight: 1.1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            <div>
                {event.estado}
            </div>
            <strong style={{fontSize:"0.75rem"}}>{horaInicio} - {horaFin}</strong>
        </div>
    );
}