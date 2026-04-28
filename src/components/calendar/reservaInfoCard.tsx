interface Props {
    label: string;
    value?: string;
}

export default function ReservaInfoCard({ label, value }: Props) {
    return (
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "0.9rem" }}>
            <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                {label}
            </p>
            <p style={{ fontWeight: 600, color: "#111827" }}>
                {value || "-"}
            </p>
        </div>
    );
}