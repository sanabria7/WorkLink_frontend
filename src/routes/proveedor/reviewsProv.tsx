import { useEffect, useState } from "react";
import * as reviewService from "../../api/reviewService";
import type { Review } from "../../types/userTypes";
import ReviewCard from "../../components/reviews/reviewCard";
import ReviewStats from "../../components/reviews/reviewStats";
import { useAuth } from "../../auth/authProvider";
import Icon from "../../components/misc/icon";
import { useNavigate } from "react-router-dom";

export default function ProveedorReviews() {
    const { perfilProveedor } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargarReviews() {
            if (!perfilProveedor?.id) return;
            try {
                const data = await reviewService.getReviewsByProveedor(perfilProveedor.id);
                console.log("Reviews del proveedor:", data);
                setReviews(data);
            } catch (error) {
                console.error("Error cargando reseñas del proveedor:", error);
            } finally {
                setLoading(false);
            }
        }
        cargarReviews();
    }, [perfilProveedor?.id]);

    const handleVerServicio = (servicioId: number) => {
        if (servicioId) { navigate(`/servicio/${servicioId}`) }
    }

    if (loading) { return (<div style={{ padding: "32px" }}>Cargando tus reseñas...</div>); }

    return (
        <div style={{ padding: "2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div>
                    <h1 style={{ fontSize: "2.25rem", fontWeight: 700, margin: 0 }}>Mis Reseñas</h1>
                    <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>Lo que dicen tus clientes sobre tus servicios</p>
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#2563eb" }}>
                    Tienes {reviews.length} reseñas
                </div>
            </div>
            <ReviewStats reviews={reviews} />
            {reviews.length === 0 ? (
                <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "2rem", textAlign: "center", border: "1px dashed #e5e7eb" }}>
                    <span style={{ fontSize:"2.2rem", opacity: 0.3 }}> :( </span>
                    <h2 style={{ marginTop: "1.5rem" }}>Aún no tienes reseñas</h2>
                    <p style={{ color: "#6b7280", maxWidth: "420px", margin: "1rem auto 0" }}>
                        Cuando completes servicios, tus clientes podrán dejarte reseñas aquí.
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection:"column", width:"100%", gap:"8px" }}>
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} showServiceName={true} onVerServicio={handleVerServicio} />
                    ))}
                </div>
            )}
        </div>
    );
}