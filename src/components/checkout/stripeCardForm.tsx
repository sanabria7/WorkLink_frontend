import { CardElement } from "@stripe/react-stripe-js";

export default function StripeCardForm() {
    return (
        <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Datos de la tarjeta
                </label>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
                    Tu pago será retenido hasta que el servicio se complete.
                </p>
            </div>
            <div style={{ backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "14px", padding: "1rem" }}>
                <CardElement
                    options={{
                        hidePostalCode: true,
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#111827",
                                "::placeholder": {
                                    color: "#9ca3af",
                                },
                            },
                            invalid: {
                                color: "#dc2626",
                            },
                        },
                    }}
                />
            </div>
            <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "0.75rem" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#1d4ed8", fontWeight: 500 }}>
                    Tarjeta de prueba:
                </p>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#2563eb" }}>
                    4242 4242 4242 4242
                </p>
            </div>
        </div>
    );
}