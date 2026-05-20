import { Dialog, DialogPanel } from "@headlessui/react";
import type { Review } from "../../types/userTypes";
import ReviewCard from "../reviews/reviewCard";
import ReviewStats from "../reviews/reviewStats";
import Icon from "../misc/icon";

interface ReviewsModalProps {
    open: boolean;
    onClose: () => void;
    reviews: Review[];
}

export default function ReviewsModal({ open, onClose, reviews, }: ReviewsModalProps) {
    return (
        <Dialog open={open} onClose={onClose} style={{ position: "fixed", inset: 0, zIndex: 100 }}>
            <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "24px", backgroundColor: "rgba(0,0,0,0.7)" }}>
                <DialogPanel style={{ backgroundColor: "white", width: "100%", maxWidth: "1100px", maxHeight: "90vh", borderRadius: "32px", border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {/* Header */}
                    <div style={{ padding: "24px 32px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>Todas las reseñas</h2>
                        </div>
                        <button onClick={onClose} style={{ border: "none", background: "#f3f4f6", width: "42px", height: "42px", borderRadius: "999px", cursor: "pointer", fontSize: "18px", fontWeight: 700 }}>
                            <Icon name="close"/>
                        </button>
                    </div>
                    {/* Body */}
                    <div style={{ overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "18px" }}>
                        <ReviewStats reviews={reviews} />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}