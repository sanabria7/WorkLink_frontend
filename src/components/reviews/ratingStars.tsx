import Icon from "../misc/icon";

interface RatingStarsProps {
    rating: number;
    size?: number;
}

export default function RatingStars({ rating, size = 20, }: RatingStarsProps) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= Math.round(rating);
                return (
                    <span
                        key={star}
                        style={{ color: active ? "#facc15" : "#d1d5db", display: "flex", fontSize: `${size}px` }}
                    >
                        <Icon name={active ? "star_filled" : "star"}/>
                    </span>
                );
            })}
        </div>
    );
}