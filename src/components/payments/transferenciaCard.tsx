import type { TransferenciaPendiente } from "../../types/pagosTypes";
import PaymentStatusBadge from "./paymentStatusBadge";
import Icon from "../misc/icon";

interface Props {
    transferencia: TransferenciaPendiente;
    onMarcarTransferido: (id: string) => void;
}

export default function TransferenciaCard({ transferencia, onMarcarTransferido }: Props) {
    const puedeMarcar = transferencia.estado === "PENDIENTE";
    return (
        <article style={{ backgroundColor: "white", border: "1px solid #e5e7eb", padding: "1.25rem", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div>
                    <p style={{ margin: "0 0 0.35rem 0", color: "#6b7280", fontSize: "0.9rem" }}>Pago</p>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>{transferencia.pagoID}</h3>
                    <p style={{ margin: "0.35rem 0 0 0", color: "#6b7280" }}>Proveedor #{transferencia.proveedorID}</p>
                </div>
                <PaymentStatusBadge status={transferencia.estado} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.9rem" }}>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Titular</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>{transferencia.titular}</p>
                </div>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Banco</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>{transferencia.banco}</p>
                </div>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Tipo de cuenta</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>{transferencia.tipoCuenta}</p>
                </div>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Monto</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>${Number(transferencia.monto || 0).toLocaleString("es-CO")}</p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.9rem" }}>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Número de cuenta</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>{transferencia.numeroCuenta}</p>
                </div>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Documento</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>{transferencia.documento}</p>
                </div>
                <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "18px", padding: "0.9rem" }}>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6b7280", fontSize: "0.85rem" }}>Fecha</p>
                    <p style={{ margin: 0, fontWeight: 700 }}>{transferencia.createdAt ? new Date(transferencia.createdAt).toLocaleString("es-CO") : "-"}</p>
                </div>
            </div>

            {/* {puedeMarcar && onMarcarTransferido && (
                <button
                    onClick={() => onMarcarTransferido(transferencia.id)}
                    style={{ marginTop: "1.25rem", width: "100%", padding: "1rem", backgroundColor: "#15803d", color: "white", border: "none", borderRadius: "14px", fontWeight: 600, fontSize: "1.05rem", cursor: "pointer"}}
                >
                    Marcar como Transferido (Ya realicé el pago bancario)
                </button>
            )} */}

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#6b7280", fontSize: "0.85rem" }}>
                <Icon name="info" />
                <span>Cuando el estado cambie a TRANSFERIDO, esta tarjeta reflejará la liberación de fondos.</span>
            </div>
        </article>
    );
}