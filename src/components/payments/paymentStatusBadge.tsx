interface Props {
    status?: string | null;
}

export default function PaymentStatusBadge({ status }: Props) {
    const value = (status || "SIN ESTADO").toUpperCase();

    const palette: Record<string, { bg: string; border: string; color: string }> = {
        PENDIENTE: { bg: "#fff7ed", border: "#fed7aa", color: "#c2410c" },
        RETENIDO: { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8" },
        EXITOSO: { bg: "#ecfdf5", border: "#bbf7d0", color: "#15803d" },
        LIBERADO: { bg: "#ecfdf5", border: "#bbf7d0", color: "#15803d" },
        TRANSFERIDO: { bg: "#ecfdf5", border: "#bbf7d0", color: "#15803d" },
        RECHAZADO: { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c" },
        REEMBOLSADO: { bg: "#f5f3ff", border: "#ddd6fe", color: "#6d28d9" },
        CANCELADO: { bg: "#f3f4f6", border: "#d1d5db", color: "#374151" },
        ERROR: { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c" },
        DESCONOCIDO: { bg: "#f3f4f6", border: "#d1d5db", color: "#374151" },
        "SIN ESTADO": { bg: "#f3f4f6", border: "#d1d5db", color: "#374151" },
    };

    const style = palette[value] || palette.DESCONOCIDO;

    return (
        <span style={{ display: "inline-flex", alignItems: "center", padding: "0.35rem 0.7rem", borderRadius: "999px", border: `1px solid ${style.border}`, backgroundColor: style.bg, color: style.color, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.02em" }}>
            {value}
        </span>
    );
}