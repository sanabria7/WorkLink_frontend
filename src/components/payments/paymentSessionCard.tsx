import { useState } from "react";
import type { PaymentSession } from "../../types/pagosTypes";
import PaymentStatusBadge from "./paymentStatusBadge";
import Icon from "../misc/icon";

interface Props {
    session: PaymentSession;
}

export default function PaymentSessionCard({ session }: Props) {
    const [copied, setCopied] = useState(false);

    const token = session.pago.tokenConfirmacion || "SIN TOKEN";
    const serviceTitle = session.servicio?.titulo || `Servicio #${session.pago.servicioID ?? "-"}`;
    const providerName = session.servicio?.proveedor?.usuario
        ? `${session.servicio.proveedor.usuario.nombre} ${session.servicio.proveedor.usuario.apellido}`
        : `Proveedor #${session.pago.proveedorID ?? "-"}`;
    const reservaId = session.reserva?.idReserva || "Sin reserva asociada";

    async function handleCopy() {
        if (!session.pago.tokenConfirmacion) return;
        await navigator.clipboard.writeText(session.pago.tokenConfirmacion);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    }

    return (
        <article style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "28px", padding: "1.25rem", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div>
                    <p style={{ margin: "0 0 0.35rem 0", fontSize: "0.9rem", color: "#6b7280" }}>Servicio</p>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800 }}>{serviceTitle}</h3>
                    <p style={{ margin: "0.35rem 0 0 0", color: "#6b7280" }}>{providerName}</p>
                </div>
                <PaymentStatusBadge status={session.pago.estadoPago} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.9rem" }}>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Pago</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>{session.pago.pagoID || "Pendiente de ID"}</p>
                </div>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Reserva</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>{reservaId}</p>
                </div>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Método</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>{session.pago.metodoPago || "-"}</p>
                </div>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Monto</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>${Number(session.pago.montoPago || 0).toLocaleString("es-CO")}</p>
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
                        disabled={!session.pago.tokenConfirmacion}
                        style={{ border: "none", backgroundColor: session.pago.tokenConfirmacion ? "#2563eb" : "#93c5fd", color: "white", borderRadius: "12px", padding: "0.8rem 1rem", fontWeight: 700, cursor: session.pago.tokenConfirmacion ? "pointer" : "not-allowed" }}
                    >
                        {copied ? "Copiado" : "Copiar token"}
                    </button>
                </div>
                <p style={{ margin: 0, color: "#1e3a8a", fontSize: "0.9rem" }}>
                    Comparte este token con tu proveedor. Es la referencia que el backend usa para confirmar el pago retenido.
                </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", color: "#6b7280", fontSize: "0.9rem" }}>
                <span>Cliente ID: {session.pago.clienteID ?? "-"}</span>
                <span>Proveedor ID: {session.pago.proveedorID ?? "-"}</span>
                <span>Servicio ID: {session.pago.servicioID ?? "-"}</span>
                <span>Fecha: {session.pago.fechaPago ? new Date(session.pago.fechaPago).toLocaleString("es-CO") : session.createdAt}</span>
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