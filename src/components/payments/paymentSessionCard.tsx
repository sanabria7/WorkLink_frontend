import { useState } from "react";
import type { PaymentSession } from "../../types/pagosTypes";
import PaymentStatusBadge from "./paymentStatusBadge";
import Icon from "../misc/icon";

interface Props {
    session: PaymentSession;
}

export default function PaymentSessionCard({ session }: Props) {
    const [copied, setCopied] = useState(false);
    const pago = session.pago;
    const monto = Number(pago.monto || 0)
    const token = pago.tokenConfirmacion || "SIN TOKEN";
    const serviceTitle = `Servicio #${pago.servicioID || "-"}`;
    const providerName = `Proveedor #${pago.proveedorID || "-"}`
    const reservaId = session.reserva?.idReserva || "Sin reserva asociada";
    const fecha = pago.fechaPago ? new Date(pago.fechaPago).toLocaleString("es-CO") : session.createdAt;

    async function handleCopy() {
        if (!pago.tokenConfirmacion) return;
        await navigator.clipboard.writeText(pago.tokenConfirmacion);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    }

    return (
        <article style={{ backgroundColor: "white", border: "1px solid #e5e7eb", padding: "1.25rem", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div>
                    <p style={{ margin: "0 0 0.35rem 0", fontSize: "0.9rem", color: "#6b7280" }}>Servicio</p>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800 }}>{serviceTitle}</h3>
                    <p style={{ margin: "0.35rem 0 0 0", color: "#6b7280" }}>{providerName}</p>
                </div>
                <PaymentStatusBadge status={pago.estadoPago} />
            </div>

	    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "1rem" }}>
                    <p style={{ margin: "0 0 0.35rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Monto Pagado</p>
                    <p style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700 }}>${monto.toLocaleString("es-CO")}</p>
                </div>

                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "1rem" }}>
                    <p style={{ margin: "0 0 0.35rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Referencia</p>
                    <p style={{ margin: 0, fontWeight: 600, fontFamily: "monospace" }}>{reservaId}</p>
                </div>

                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "1rem" }}>
                    <p style={{ margin: "0 0 0.35rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Método</p>
                    <p style={{ margin: 0, fontWeight: 600 }}>{pago.metodoPago}</p>
                </div>

                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "1rem" }}>
                    <p style={{ margin: "0 0 0.35rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Fecha</p>
                    <p style={{ margin: 0, fontWeight: 600 }}>{fecha}</p>
                </div>
            </div>
	    
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "20px", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                        <p style={{ margin: "0 0 0.2rem 0", color: "#1d4ed8", fontSize: "0.85rem", fontWeight: 700 }}>Token de confirmación</p>
                        <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1e3a8a", letterSpacing: "0.08em" }}>{token}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!pago.tokenConfirmacion}
                        style={{ border: "none", backgroundColor: pago.tokenConfirmacion ? "#2563eb" : "#93c5fd", color: "white", borderRadius: "12px", padding: "0.8rem 1rem", fontWeight: 700, cursor: pago.tokenConfirmacion ? "pointer" : "not-allowed" }}
                    >
                        {copied ? "Copiado" : "Copiar token"}
                    </button>
                </div>
                <p style={{ margin: 0, color: "#1e3a8a", fontSize: "0.9rem" }}>
                    Comparte este token con tu proveedor. Es la referencia que el backend usa para confirmar el pago retenido.
                </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", color: "#6b7280", fontSize: "0.9rem" }}>
                <span>Cliente ID: {pago.clienteID ?? "-"}</span>
                <span>Proveedor ID: {pago.proveedorID ?? "-"}</span>
                <span>Servicio ID: {pago.servicioID ?? "-"}</span>
                <span>Fecha: {fecha}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", color: "#6b7280", fontSize: "0.9rem" }}>
                <span>Tarjeta / Reserva: {session.reserva?.rangoTiempoReservado || "Sin rango guardado"}</span>
                <span>Estado reserva: {session.reserva?.estadoReserva || "EN_CURSO"}</span>
                <span>Slots: {session.idsSlots?.length ? session.idsSlots.length : 0}</span>
                <span>Fuente: checkout</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#6b7280", fontSize: "0.85rem" }}>
                <Icon name="info" />
                <span>Esta tarjeta resume lo que el backend devuelve hoy y lo que ya queda guardado al completar el checkout.</span>
            </div>
        </article>
    );
}