import { useEffect, useState } from "react";
import type { Review } from "../../types/userTypes";
import { getReviewsByServicio } from "../../api/reviewService";
import ReviewCard from "./reviewCard";
import ReviewStats from "./reviewStats";
import ReviewsModal from "../modals/reviewServiceModal";

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

    return (
        <section style={{ display: "flex", flexDirection: "column", gap: "10px"}}>
            <ReviewStats reviews={reviews} />
            {loading ? (
                <p>Cargando reseñas...</p>
            ) : reviews.length === 0 ? (
                <p>Este servicio todavía no tiene reseñas.</p>
            ) : (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "24px 28px" }}>
                        {reviews.slice(0, 3).map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                    {reviews.length > 3 && (
                        <button
                            onClick={() => setModalOpen(true)}
                            style={{ width: "100%", padding: "12px 18px", border: "none", borderRadius:"10px", backgroundColor: "none", cursor: "pointer", fontWeight: 600 }}>
                            Ver todas las reseñas
                        </button>
                    )}
                </>
            )}
            <ReviewsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                reviews={reviews}
            />
        </section>
    );
}