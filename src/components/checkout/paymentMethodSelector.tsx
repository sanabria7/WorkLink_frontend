import type React from "react";
import type { MetodoPago } from "../../types/pagosTypes";
import StripeCardForm from "./stripeCardForm";

interface Props {
    metodoPago: MetodoPago;
    setMetodoPago: React.Dispatch<React.SetStateAction<MetodoPago>>;
}

export default function PaymentMethodSelector({ metodoPago, setMetodoPago }: Props) {
    return (
        <section style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ margin: "0 0 0.8rem 0", fontSize: "1.15rem", fontWeight: 700 }}>Método de pago</h2>
            <p style={{ margin: "0 0 1rem 0", color: "#6b7280" }}>El backend ya contempla tarjeta, PSE y efectivo. Por ahora la tarjeta es la opción con más detalle visual; las otras se conservan listas para extender la UI.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                {(["TARJETA", "PSE", "EFECTIVO"] as MetodoPago[]).map((m) => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => setMetodoPago(m)}
                        style={{
                            border: metodoPago === m ? "2px solid #2563eb" : "1px solid #d1d5db",
                            backgroundColor: metodoPago === m ? "#eff6ff" : "white",
                            borderRadius: "16px",
                            padding: "0.9rem",
                            cursor: "pointer",
                            fontWeight: 700
                        }}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {metodoPago === "TARJETA" && (
                <StripeCardForm />
            )}
            {metodoPago === "PSE" && (
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1rem", color: "#6b7280" }}>
                    Serás redirigido a tu banco para completar el pago.
                </div>
            )}
            {metodoPago === "EFECTIVO" && (
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1rem", color: "#6b7280" }}>
                    El pago quedará pendiente hasta ser confirmado manualmente.
                </div>
            )}
        </section>
    );
}