import { useNavigate } from "react-router-dom";

export default function CheckoutUnavailable() {

    const navigate = useNavigate();

    return (
        <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "24px", padding: "2rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                    Checkout no disponible
                </h1>
                <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
                    No hay datos de reserva para procesar el pago.
                </p>
                <button
                    onClick={() => navigate("/home", { replace: true })}
                    style={{ border: "none", backgroundColor: "#2563eb", color: "white", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: "pointer", fontWeight: 600 }}
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    );
}