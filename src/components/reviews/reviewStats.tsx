import type { Review } from "../../types/userTypes";
import Icon from "../misc/icon";

interface ReviewStatsProps {
    reviews: Review[];
}

export default function ReviewStats({ reviews }: ReviewStatsProps) {
    const totalReviews = reviews.length;

    const promedio = totalReviews > 0
        ? reviews.reduce(
            (acc, review) =>
                acc + review.calificacion,
            0
        ) / totalReviews
        : 0;

    return (
        <div style={{ border: "none", marginBottom: "10px" }}>
            <div>
                <div style={{ display: "flex", justifyContent: "flex-start", flexDirection: "row", width:"100%", alignItems:"center"}}>
                    <span style={{marginTop:"8px", display: "flex", alignItems:"center"}}>
                        <Icon name="star_filled"/>
                    </span>
                    <h2 style={{ fontWeight: "600", lineHeight: "1", marginTop:"8px", marginBottom:"2px", marginLeft:"4px" }}>{promedio.toFixed(1)}</h2> 
                    <h2 style={{ fontWeight: "600", lineHeight: "1", marginTop: "8px", marginBottom:"2px", marginLeft: "10px"  }}> • {totalReviews} Reseñas</h2>
                </div>
            </div>
        </div>
    );
}