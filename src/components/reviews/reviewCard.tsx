import type { Review } from "../../types/userTypes";
import RatingStars from "./ratingStars";

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Avatar fake temporal */}
                <div style={{ width: "48px", height: "48px", borderRadius: "999px", backgroundColor: "#e5e7eb", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontWeight: 600, fontSize: "15px" }}>Usuario</span>
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>Hace poco</span>
                </div>
            </div>
            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <RatingStars rating={review.calificacion} size={14} />
            </div>
            {/* Comentario */}
            <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.35", color: "#222222", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {review.comentario}
            </p>
        </div>
    );
}