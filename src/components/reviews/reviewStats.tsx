import type { Review } from "../../types/userTypes";
import RatingStars from "./ratingStars";
import Icon from "../misc/icon";

interface ReviewStatsProps {
    reviews: Review[];
}

export default function ReviewStats({ reviews }: ReviewStatsProps) {
    const totalReviews = reviews.length;
    const promedio = totalReviews > 0
        ? reviews.reduce((acc, review) => acc + review.calificacion, 0) / totalReviews
        : 0;
    
    const distribucion = [5,4,3,2,1].map(stars => ({
        stars,
        count: reviews.filter(r => Math.round(r.calificacion) === stars).length,
        porcentaje: totalReviews > 0 ? Math.round((reviews.filter(r => Math.round(r.calificacion) === stars).length / totalReviews)*100) : 0
    }))

    return (
        <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "1.75rem", marginBottom: "2rem", marginTop:"1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "3.2rem", fontWeight: 700, lineHeight: 1 }}>{promedio.toFixed(1)}</div>
                <div>
                    <RatingStars rating={promedio} size={28} />
                    <p style={{ margin: "0.25rem 0 0 0", color: "#6b7280" }}>{totalReviews} reseñas</p>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {distribucion.map(({ stars, count, porcentaje }) => (
                    <div key={stars} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{display: "flex", alignItems: "center", color: "#1e1e1e", gap: "2px", width: "40px", fontSize: "1rem", fontWeight: 400 }}>{stars}<Icon name="star_filled"/></span>
                        <div style={{ flex: 1, height: "8px", backgroundColor: "#f3f4f6", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ width: `${porcentaje}%`, height: "100%", backgroundColor: "#facc15", borderRadius: "999px" }} />
                        </div>
                        <span style={{ width: "40px", textAlign: "right", color: "#6b7280", fontSize: "0.9rem" }}>{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}