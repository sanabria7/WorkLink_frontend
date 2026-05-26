import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as reviewService from "../../api/reviewService";
import type { Review } from "../../types/userTypes";
import ReviewCard from "../../components/reviews/reviewCard";
import { useAuth } from "../../auth/authProvider";
import Icon from "../../components/misc/icon";

export default function MisReseñasCliente() {
    const { perfilCliente } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function cargarMisReseñas() {
            if (!perfilCliente?.id) return;
            try {
                const data = await reviewService.getReviewsByCliente(perfilCliente.id.toString());
                console.log("Reviews del cliente:", data);
                setReviews(data);
            } catch (error) {
                console.error("Error cargando mis reseñas:", error);
            } finally {
                setLoading(false);
            }
        }
        cargarMisReseñas();
    }, [perfilCliente?.id]);

    const handleVerServicio = (servicioId?: number) => {
        if (servicioId) { navigate(`/servicio/${servicioId}`); }
    };

    if (loading) {
        return <div style={{ padding: "4rem", textAlign: "center" }}>Cargando tus reseñas...</div>;
    }

    return (
        <div style={{ padding: "2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                    <h1 style={{ fontSize: "2.25rem", fontWeight: 700, margin: 0 }}>Mis Reseñas</h1>
                    <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>Opiniones que has dejado sobre los servicios</p>
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#2563eb" }}>
                    He escrito un total de {reviews.length} reseñas
                </div>
            </div>
            {reviews.length === 0 ? (
                <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "5rem 2rem", textAlign: "center", border: "1px dashed #e5e7eb" }}>
                    <span style={{ display: "flex", alignItems: "center", fontSize: "4rem", opacity: 0.3 }}><Icon name="star" /></span>
                    <h2 style={{ marginTop: "1.5rem" }}>Aún no has escrito reseñas</h2>
                    <p style={{ color: "#6b7280", maxWidth: "420px", margin: "1rem auto 0" }}>
                        Cuando completes servicios, podrás dejar tu opinión aquí.
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