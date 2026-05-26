import type { TransferenciaResponse } from "../../types/pagosTypes";
import PaymentStatusBadge from "./paymentStatusBadge";

interface Props {
    tokenConfirmacion: string;
    setTokenConfirmacion: (value: string) => void;
    proveedorId?: number | null;
    loading: boolean;
    response: TransferenciaResponse | null;
    onConfirm: () => Promise<void>;
}

export default function ConfirmTokenPanel({ tokenConfirmacion, setTokenConfirmacion, proveedorId, loading, response, onConfirm }: Props) {
    return (
        <section style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "28px", padding: "1.25rem", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>Confirmar pago con token</h2>
                <p style={{ margin: "0.4rem 0 0 0", color: "#6b7280" }}>
                    Aquí el proveedor ingresa el token que le compartió el cliente. El backend valida el pago retenido y crea la transferencia pendiente.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "0.9rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    <label htmlFor="tokenConfirmacion" style={{ fontWeight: 700 }}>Token de confirmación</label>
                    <input
                        id="tokenConfirmacion"
                        name="tokenConfirmacion"
                        value={tokenConfirmacion}
                        onChange={(e) => setTokenConfirmacion(e.target.value.toUpperCase())}
                        placeholder="Ej. K7M2P9XQ"
                        style={{ border: "1px solid #d1d5db", borderRadius: "14px", padding: "0.95rem 1rem", outline: "none" }}
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    <label style={{ fontWeight: 700 }}>Proveedor ID</label>
                    <input
                        value={proveedorId ?? "-"}
                        readOnly
                        style={{ border: "1px solid #e5e7eb", borderRadius: "14px", padding: "0.95rem 1rem", backgroundColor: "#f9fafb", color: "#6b7280" }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "end" }}>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading || !tokenConfirmacion.trim()}
                    style={{ border: "none", backgroundColor: loading || !tokenConfirmacion.trim() ? "#93c5fd" : "#2563eb", color: "white", borderRadius: "14px", padding: "0.9rem 1.2rem", cursor: loading || !tokenConfirmacion.trim() ? "not-allowed" : "pointer", fontWeight: 700 }}
                >
                    {loading ? "Confirmando..." : "Confirmar cobro"}
                </button>
            </div>

            {response && (
                <div style={{ backgroundColor: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <strong>{response.mensaje}</strong>
                        <PaymentStatusBadge status={response.estadoTransferencia} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem" }}>
                        <div>
                            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>Transferencia</p>
                            <p style={{ margin: 0, fontWeight: 700 }}>{response.transferenciaID || "-"}</p>
                        </div>
                        <div>
                            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>Pago</p>
                            <p style={{ margin: 0, fontWeight: 700 }}>{response.pagoID || "-"}</p>
                        </div>
                        <div>
                            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>Banco</p>
                            <p style={{ margin: 0, fontWeight: 700 }}>{response.banco || "-"}</p>
                        </div>
                        <div>
                            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>Monto</p>
                            <p style={{ margin: 0, fontWeight: 700 }}>${Number(response.monto || 0).toLocaleString("es-CO")}</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}