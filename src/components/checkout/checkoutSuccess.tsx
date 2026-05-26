import { useState } from "react";
import type { PagoResponse } from "../../types/pagosTypes";
import type { ReservaResponse } from "../../types/reservaTypes";
import type { profilesService } from "../../types/serviceTypes";
import Icon from "../misc/icon";

interface Props {
    resultadoPago: PagoResponse;
    reservaCreada: ReservaResponse;
    servicio: profilesService;
    onGoPagos: () => void;
    onBackServicios: () => void;
}

export default function CheckoutSuccess({ resultadoPago, reservaCreada, servicio, onGoPagos, onBackServicios }: Props) {
    const [copied, setCopied] = useState(false);

    async function copiarToken() {
        if (!resultadoPago.tokenConfirmacion) return;
        await navigator.clipboard.writeText(resultadoPago.tokenConfirmacion);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ backgroundColor: "white", borderRadius: "28px", border: "1px solid #e5e7eb", padding: "2rem", boxShadow: "0 6px 24px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <span style={{ width: "44px", height: "44px", borderRadius: "999px", backgroundColor: "#dcfce7", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="success" />
                    </span>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700 }}>Pago retenido y reserva creada</h1>
                        <p style={{ margin: "0.25rem 0 0 0", color: "#6b7280" }}>{resultadoPago.mensaje}</p>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
                    <div style={{ backgroundColor: "#f9fafb", borderRadius: "18px", padding: "1rem", border: "1px solid #e5e7eb" }}>
                        <p style={{ margin: "0 0 0.35rem 0", color: "#6b7280", fontSize: "0.9rem" }}>Servicio</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>{servicio.titulo}</p>
                    </div>
                    <div style={{ backgroundColor: "#f9fafb", borderRadius: "18px", padding: "1rem", border: "1px solid #e5e7eb" }}>
                        <p style={{ margin: "0 0 0.35rem 0", color: "#6b7280", fontSize: "0.9rem" }}>Reserva</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>{reservaCreada.reservaDTO?.idReserva}</p>
                    </div>
                </div>

                <div style={{ marginTop: "1.25rem", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "24px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                        <div>
                            <p style={{ margin: 0, color: "#1d4ed8", fontSize: "0.9rem", fontWeight: 700 }}>Token de confirmación</p>
                            <p style={{ margin: "0.25rem 0 0 0", fontSize: "1.05rem", fontWeight: 800, color: "#1e3a8a", letterSpacing: "0.08em" }}>
                                {resultadoPago.tokenConfirmacion || "Aún no disponible"}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={copiarToken}
                            disabled={!resultadoPago.tokenConfirmacion}
                            style={{ border: "none", backgroundColor: resultadoPago.tokenConfirmacion ? "#2563eb" : "#93c5fd", color: "white", borderRadius: "12px", padding: "0.85rem 1rem", cursor: resultadoPago.tokenConfirmacion ? "pointer" : "not-allowed", fontWeight: 700 }}
                        >
                            {copied ? "Copiado" : "Copiar token"}
                        </button>
                    </div>
                    <p style={{ margin: 0, color: "#1e3a8a", fontSize: "0.92rem" }}>
                        Este token es el que el proveedor registra para liberar el pago cuando el servicio se complete.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                    <button onClick={onGoPagos} style={{ border: "none", fontSize: "1rem", backgroundColor: "#2563eb", color: "white", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: "pointer", fontWeight: 600 }}>
                        Ver mis pagos
                    </button>
                    <button onClick={onBackServicios} style={{ border: "1px solid #d1d5db", fontSize: "1rem", backgroundColor: "white", color: "#111827", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: "pointer", fontWeight: 600 }}>
                        Volver al servicio
                    </button>
                </div>
            </div>
        </div>
    );
}