import { useEffect, useState } from "react";
import * as reviewService from "../../api/reviewService";
import type { Review } from "../../types/userTypes";
import ReviewCard from "../../components/reviews/reviewCard";
import ReviewStats from "../../components/reviews/reviewStats";
import { useAuth } from "../../auth/authProvider";

export default function ProveedorReviews() {
    const { perfilProveedor } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargarReviews() {
            if (!perfilProveedor?.id) return;
            try {
                console.log("PERFIL PROVEEDOR:", perfilProveedor);
                console.log("ID PROVEEDOR:", perfilProveedor);
                const data = await reviewService.getReviewsByProveedor(perfilProveedor.id);
                console.log("REVIEWS DATA:", data);
                setReviews(data);
            } catch (error) {
                console.error("ERROR REVIEWS:", error);
            } finally {
                setLoading(false);
            }
        }
        cargarReviews();
    }, [perfilProveedor?.id]);

    if (loading) {
        return (
            <div style={{ padding: "32px" }}>
                Cargando reseñas...
            </div>
        );
    }

    return (
        <div style={{ padding: "32px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "40px", fontWeight: "700", marginBottom: "32px" }}>Reseñas</h1>
                <ReviewStats reviews={reviews} />
                {reviews.length === 0 ? (
                    <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "48px", textAlign: "center", border: "1px solid #e5e7eb" }}>
                        <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Todavía no tienes reseñas</h2>
                        <p style={{ color: "#6b7280" }}>Cuando completes servicios, aparecerán aquí.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}