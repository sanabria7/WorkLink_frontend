interface ReservaEmptyStateProps {
    text: string;
}

export default function ReservaEmptyState({ text }: ReservaEmptyStateProps) {
    return (
        <div style={{ minHeight: "220px", display: "grid", placeItems: "center", textAlign: "center", border: "1px dashed #cbd5e1", borderRadius: "16px", color: "#64748b", padding: "20px" }}>
            {text}
        </div>
    );
}