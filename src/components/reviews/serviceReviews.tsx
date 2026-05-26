import { useEffect, useState } from "react";
import type { Review } from "../../types/userTypes";
import { getReviewsByServicio } from "../../api/reviewService";
import ReviewCard from "./reviewCard";
import ReviewsModal from "../modals/reviewServiceModal";
import Icon from "../misc/icon";

interface Props {
    servicioId: string;
}

export default function ServiceReviews({ servicioId }: Props) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        async function cargarReviews() {
            try {
                setLoading(true);
                const data = await getReviewsByServicio(servicioId);
                console.log("REVIEWS SERVICIO:", data);
                setReviews(data);
            } catch (error) {
                console.error("Error cargando reseñas:", error);
            } finally {
                setLoading(false);
            }
        }
        cargarReviews();
    }, [servicioId]);

    if (loading) { return <div style={{ padding: "3rem", textAlign: "center" }}>Cargando reseñas...</div>; }
    if (reviews.length === 0) <div style={{ fontWeight: "400", color: "grey", fontSize: "0.8rem" }}>Este servicio aún no tiene reseñas</div>

    return (
        <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}><Icon name="star_filled" />Reseñas</h2>
                {reviews.length > 3 && (
                    <button
                        onClick={() => setModalOpen(true)}
                        style={{ color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                    >
                        Ver todas ({reviews.length})
                    </button>
                )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "8px", marginTop: "0.75rem" }}>
                {reviews.slice(0, 3).map(review => (
                    <ReviewCard key={review.id} review={review} showServiceName={false} />
                ))}
            </div>
            <ReviewsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                reviews={reviews}
            />
        </div>
    );
}