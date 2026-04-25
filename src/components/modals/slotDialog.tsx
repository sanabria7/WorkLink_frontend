import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { Evento } from "../../types/horariosTypes";

interface SlotDialogProps {
    evento: Evento | null;
    onClose: () => void;
    onChangeState: (nuevoEstado: "Disponible" | "No disponible") => void;
}

export default function SlotDialog({ evento, onClose, onChangeState }: SlotDialogProps) {
    if (!evento) return null;
    const isDisponible = evento.estado === "Disponible";
    const horaInicio = evento.start.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const horaFin = evento.end.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <Dialog open={!!evento} onClose={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "rgba(0,0,0,0.6)" }}>
                <DialogPanel style={{ backgroundColor: "#ffffff", borderRadius: "1.5rem", padding: "2rem", maxWidth: "28rem", width: "100%", margin: "0 1rem" }}>
                    <DialogTitle style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>Editar disponibilidad</DialogTitle>
                    <Description style={{ color: "#4B5563"}}>
                        {horaInicio} - {horaFin} • Estado actual: {evento.estado}                        
                    </Description>
                    <p style={{ fontSize: "1rem", fontWeight: "400"}}>Cambiar estado de disponibilidad a:</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        
                        {isDisponible ? (
                            <button onClick={() => onChangeState("No disponible")} style={{ paddingTop: "1rem", paddingBottom: "1rem", backgroundColor: "#FEE2E2", color: "#B91C1C", borderRadius: "1rem", fontWeight: "500", border: "none", cursor: "pointer" }}>
                                <strong style={{ fontSize: "1rem", fontWeight: "600"}}>No disponible</strong>
                            </button>
                        ) : (
                            <button onClick={() => onChangeState("Disponible")} style={{ paddingTop: "1rem", paddingBottom: "1rem", backgroundColor: "#D1FAE5", color: "#047857", borderRadius: "1rem", fontWeight: "500", border: "none", cursor: "pointer" }}>
                                <strong style={{ fontSize: "1rem", fontWeight: "600"}}>Disponible</strong>
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} style={{ marginTop: "1.5rem", width: "100%", paddingTop: "0.75rem", paddingBottom: "0.75rem", color: "#6B7280", fontWeight: "500", border: "none", background: "none", cursor: "pointer" }}>
                        <strong style={{ fontSize: "1rem", fontWeight: "400"}}>Cancelar</strong>
                    </button>
                </DialogPanel>
            </div>
        </Dialog>
    );
}