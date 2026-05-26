import { useState } from "react";
import { Dialog } from "@headlessui/react";
import type { ReservaDTO } from "../../types/reservaTypes";
import type { Review } from "../../types/userTypes";
import * as reviewService from "../../api/reviewService";
import Icon from "../misc/icon";

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    reserva: ReservaDTO | null;
}

export default function ReviewModal({ open, onClose, reserva }: ReviewModalProps) {
    const [comentario, setComentario] = useState("");
    const [calificacion, setCalificacion] = useState(0);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleGuardarReview() {
        if (!reserva) return;

        if (!comentario.trim()) {
            alert("Debes escribir un comentario");
            return;
        }

        try {
            setLoading(true);
            const nuevaReview: Review = {
                comentario,
                calificacion,
                clienteId: reserva.clienteId,
                proveedorId: reserva.proveedorId,
                serviceId: reserva.servicioId,
                /* codigoReserva: reserva.idReserva, */
            };
            console.log("PAYLOAD REVIEW:", nuevaReview);
            await reviewService.guardarReview(nuevaReview);
            alert("¡Reseña enviada con éxito! Gracias por tu opinión.");
            handleClose();
        } catch (error) {
            console.error(error);
            alert("No se pudo guardar la reseña. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        setComentario("");
        setCalificacion(5);
        onClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
            <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" }}>
                <div style={{ backgroundColor: "white", width: "100%", maxWidth: "500px", borderRadius: "24px", padding: "24px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px", marginTop: "0px" }}>
                        Dejar reseña
                    </h2>
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", fontWeight: 600, marginBottom: "10px", fontSize: "15px" }}>
                            Calificación
                        </label>
                        <p style={{ marginTop: "-4px", marginBottom: "16px", color: "#6b7280", fontSize: "14px" }}>
                            ¿Cómo fue tu experiencia con este servicio?
                        </p>
                        <div style={{ display: "flex", gap: "6px" }}>
                            {[1, 2, 3, 4, 5].map((star) => {
                                const active =
                                    hoveredStar !== null
                                        ? star <= hoveredStar
                                        : star <= calificacion;
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(null)}
                                        onClick={() => setCalificacion(star)}
                                        style={{ border: "none", background: "none", cursor: "pointer", padding: "0", transition: "all 0.2s ease", transform: active ? "scale(1.1)" : "scale(1)" }}
                                    >
                                        <span style={{ color: active ? "#facc15" : "#9ca3af", fontSize: "36px", display: "flex" }}>
                                            <Icon name={active ? "star_filled" : "star"} />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div style={{ marginBottom: "24px" }}>
                        <label htmlFor="comentario-review" style={{ display: "block", fontWeight: 600, marginBottom: "10px", fontSize: "15px" }}>
                            Comentario
                        </label>
                        <p style={{ marginTop: "-4px", marginBottom: "16px", color: "#6b7280", fontSize: "14px" }}>
                            Comparte detalles sobre tu experiencia.
                        </p>
                        <textarea
                            id="comentario-review"
                            name="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Escribe tu experiencia..."
                            style={{ width: "100%", minHeight: "120px", borderRadius: "12px", border: "1px solid #d1d5db", padding: "12px", resize: "none", boxSizing: "border-box", fontSize: "15px", lineHeight: "1.5" }}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "end", gap: "12px" }}>
                        <button
                            onClick={handleClose}
                            style={{ padding: "12px 16px", borderRadius: "12px", fontSize: "0.9rem", border: "1px solid #d1d5db", cursor: "pointer" }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardarReview}
                            disabled={loading}
                            style={{ padding: "12px 16px", borderRadius: "12px", border: "none", fontSize: "0.9rem", backgroundColor: "#2563eb", color: "white", cursor: "pointer" }}
                        >
                            {loading ? "Enviando..." : "Publicar reseña"}
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}