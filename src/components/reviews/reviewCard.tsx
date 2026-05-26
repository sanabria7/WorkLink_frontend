import type { Review } from "../../types/userTypes";
import RatingStars from "./ratingStars";

interface ReviewCardProps {
    review: Review;
    showServiceName?: boolean;
    onVerServicio?: (servicioId: number) => void;
}

export default function ReviewCard({ review, showServiceName = false, onVerServicio }: ReviewCardProps) {
    return (
        <div style={{ backgroundColor: "white", border: "none", padding: "1.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "999px", backgroundColor: "#f3f4f6", flexShrink: 0 }} />
                <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "1.05rem" }}>Cliente</p>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
                        {review.fechaCreacion ? new Date(review.fechaCreacion).toLocaleDateString("es-CO", { month: "long", year: "numeric" }) : "Hace poco"}
                    </p>
                </div>
            </div>
            <RatingStars rating={review.calificacion} size={22} />
            <p style={{ margin: "1rem 0 0 0", lineHeight: "1.25", color: "#1f2937", fontSize: "0.9rem" }}>
                {review.comentario}
            </p>

            {showServiceName && review.serviceId && onVerServicio && (
                <button
                    onClick={() => onVerServicio(review.serviceId!)}
                    style={{marginTop: "1rem", color:"#2563eb", textDecoration:"underline", fontWeight:"600", background:"none", border:"none", cursor:"pointer", padding:"0", fontSize:"0.8rem", display:"flex", alignItems:"center", gap:"6px"}}
                >
                    Ver servicio
                </button>
            )}
        </div>
    );
}