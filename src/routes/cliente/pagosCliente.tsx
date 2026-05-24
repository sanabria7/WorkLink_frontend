import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import PaymentSessionCard from "../../components/payments/paymentSessionCard";
import { loadPaymentSessions } from "../../utils/paymentStorage";
import type { PaymentSession } from "../../types/pagosTypes";

export default function MisPagosCliente() {
    const navigate = useNavigate();
    const { perfilCliente } = useAuth();

    const [sessions, setSessions] = useState<PaymentSession[]>([]);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    useEffect(() => {
        setSessions(loadPaymentSessions());
    }, []);

    const totals = useMemo(() => {
        const total = sessions.length;
        const retenidos = sessions.filter((s) => (s.pago.estadoPago || "").toUpperCase() === "RETENIDO").length;
        const montoTotal = sessions.reduce((acc, session) => acc + Number(session.pago.montoPago || 0), 0);
        return { total, retenidos, montoTotal };
    }, [sessions]);

    async function handleCopy(token: string, key: string) {
        await navigator.clipboard.writeText(token);
        setCopiedKey(key);
        window.setTimeout(() => setCopiedKey(null), 1500);
    }

    if (!perfilCliente?.id) {
        return (
            <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "24px", padding: "2rem" }}>
                    <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800 }}>Mis pagos</h1>
                    <p style={{ color: "#6b7280" }}>No se pudo identificar tu perfil de cliente.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1240px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800 }}>Mis pagos</h1>
                    <p style={{ margin: "0.35rem 0 0 0", color: "#6b7280" }}>Historial de pagos retenidos y reservas generadas desde este navegador.</p>
                </div>
                <button onClick={() => navigate("/mis-reservas")} style={{ border: "1px solid #d1d5db", backgroundColor: "white", borderRadius: "12px", padding: "0.85rem 1rem", cursor: "pointer", fontWeight: 600 }}>
                    Ir a mis reservas
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "24px", padding: "1rem" }}>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>Pagos guardados</p>
                    <strong style={{ fontSize: "1.7rem" }}>{totals.total}</strong>
                </div>
                <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "24px", padding: "1rem" }}>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>Pagos retenidos</p>
                    <strong style={{ fontSize: "1.7rem" }}>{totals.retenidos}</strong>
                </div>
                <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "24px", padding: "1rem" }}>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>Monto total</p>
                    <strong style={{ fontSize: "1.7rem" }}>${totals.montoTotal.toLocaleString("es-CO")}</strong>
                </div>
            </div>

            {sessions.length === 0 ? (
                <div style={{ backgroundColor: "white", borderRadius: "24px", border: "1px dashed #d1d5db", padding: "3rem", textAlign: "center" }}>
                    <h2 style={{ marginTop: 0 }}>Todavía no tienes pagos guardados</h2>
                    <p style={{ color: "#6b7280" }}>Cuando completes una reserva con pago retenido, aparecerá aquí el resumen con su token de confirmación.</p>
                    <button onClick={() => navigate("/home")} style={{ border: "none", backgroundColor: "#2563eb", color: "white", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: "pointer", fontWeight: 600 }}>
                        Ir a buscar servicios
                    </button>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {sessions.map((session) => {
                        const key = session.pago.pagoID || session.pago.tokenConfirmacion || session.createdAt;
                        return (
                            <div key={key}>
                                <PaymentSessionCard session={session} />
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                                    {session.pago.tokenConfirmacion && (
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(session.pago.tokenConfirmacion!, key)}
                                            style={{ border: "1px solid #d1d5db", backgroundColor: "white", borderRadius: "12px", padding: "0.75rem 1rem", cursor: "pointer", fontWeight: 600 }}
                                        >
                                            {copiedKey === key ? "Token copiado" : "Copiar token"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}