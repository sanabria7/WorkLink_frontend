import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/authProvider";
import { confirmarPagoConToken, getTransferenciasPendientes, marcarTransferido } from "../../api/transferenciasService";
import ConfirmTokenPanel from "../../components/payments/panelTokenConfirmacion";
import TransferenciaCard from "../../components/payments/transferenciaCard";
import PaymentStatusBadge from "../../components/payments/paymentStatusBadge";
import type { TransferenciaPendiente, TransferenciaResponse } from "../../types/pagosTypes";
import Icon from "../../components/misc/icon";
import { obtenerCuentaBancaria } from "../../api/profilesService";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";

export default function MisPagosProveedor() {
    const { perfilProveedor } = useAuth();

    const [transferencias, setTransferencias] = useState<TransferenciaPendiente[]>([]);
    const [tokenConfirmacion, setTokenConfirmacion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ultimaRespuesta, setUltimaRespuesta] = useState<TransferenciaResponse | null>(null);
    const [tieneCuentaBancaria, setTieneCuentaBancaria] = useState<boolean | null>(null);
    const [selectedTransferencia, setSelectedTransferencia] = useState<TransferenciaPendiente | null>(null);

    const proveedorId = perfilProveedor?.id ? Number(perfilProveedor.id) : null;

    const cargarTransferencias = async () => {
        if (!proveedorId) return;
        setLoading(true);
        try {
            const data = await getTransferenciasPendientes();
            const filtradas = data.filter((t) => Number(t.proveedorID) === proveedorId);
            setTransferencias(filtradas);
        } catch (err) {
            console.error("Error cargando transferencias:", err);
            setError("No se pudieron cargar las transferencias.");
            setTransferencias([]);
        } finally {
            setLoading(false);
        }
    };

    const verificarCuentaBancaria = async () => {
        if (!proveedorId) return;
        try {
            const data = await obtenerCuentaBancaria(String(proveedorId));
            setTieneCuentaBancaria(!!data.cuentaVinculada);
        } catch {
            setTieneCuentaBancaria(false);
        }
    };

    useEffect(() => {
        cargarTransferencias();
        verificarCuentaBancaria();
    }, [proveedorId]);

    const totals = useMemo(() => {
        const count = transferencias.length;
        const amount = transferencias.reduce((acc, t) => acc + Number(t.monto || 0), 0);
        return { count, amount };
    }, [transferencias]);

    async function handleConfirmar() {
        if (!proveedorId || !tokenConfirmacion.trim()) {
            setError("Escribe un token válido.");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await confirmarPagoConToken(tokenConfirmacion.trim().toUpperCase(), proveedorId);
            setUltimaRespuesta(response);
            setTokenConfirmacion("");
            alert("¡Servicio confirmado exitosamente!");
            await cargarTransferencias();
        } catch (err: any) {
            setError(err?.response?.data?.mensaje || "Error al confirmar el pago.");
        } finally {
            setLoading(false);
        }
    }

    const handleMarcarTransferido = async (id: string) => {
        const confirmar = window.confirm("¿Confirmas que ya realizaste la transferencia bancaria?");
        if (!confirmar) return;

        try {
            await marcarTransferido(id);
            alert("Transferencia marcada como realizada.");
            await cargarTransferencias();
        } catch (error) {
            console.error("Error al marcar como transferido:", error);
        }
    };

    if (loading) return <div style={{ padding: "4rem", textAlign: "center" }}>Cargando transferencias...</div>;

    return (
        <div style={{ padding: "2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2.25rem", fontWeight: 700, margin: 0 }}>Mis Pagos y Transferencias</h1>
                    <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>Gestiona confirmaciones y transferencias pendientes</p>
                </div>
            </div>

            {/* Alerta de cuenta bancaria */}
            {tieneCuentaBancaria === false && (
                <div style={{ backgroundColor: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "20px", padding: "1.75rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ fontSize: "2.2rem" }}><Icon name="error" /></div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 0.5rem 0", color: "#92400e" }}>Cuenta bancaria requerida</h3>
                        <p style={{ margin: 0, color: "#b45309" }}>Debes configurar tu cuenta antes de recibir pagos.</p>
                    </div>
                    <Link to="/configurar-cuenta-bancaria" style={{ backgroundColor: "#d97706", color: "white", padding: "0.85rem 1.75rem", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}>
                        Configurar Cuenta
                    </Link>
                </div>
            )}

            {/* Panel de Confirmación de Token */}
            {tieneCuentaBancaria !== false && (
                <div style={{ marginBottom: "2rem" }}>
                    <ConfirmTokenPanel
                        tokenConfirmacion={tokenConfirmacion}
                        setTokenConfirmacion={setTokenConfirmacion}
                        proveedorId={proveedorId}
                        loading={loading}
                        response={ultimaRespuesta}
                        onConfirm={handleConfirmar}
                    />
                    {error && (
                        <div style={{ marginTop: "1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: "12px", padding: "1rem" }}>
                            {error}
                        </div>
                    )}
                </div>
            )}

            {/* Resumen */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
                <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "1.5rem" }}>
                    <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Transferencias pendientes</p>
                    <p style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0 0" }}>{totals.count}</p>
                </div>
                <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "1.5rem" }}>
                    <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Monto total pendiente</p>
                    <p style={{ fontSize: "2rem", fontWeight: 700, margin: "0.5rem 0 0 0" }}>${totals.amount.toLocaleString("es-CO")}</p>
                </div>
                <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "1.5rem" }}>
                    <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Estado</p>
                    <PaymentStatusBadge status={transferencias.length > 0 ? "PENDIENTE" : "OK"} />
                </div>
            </div>

            {/* Tabla Profesional */}
            {transferencias.length === 0 ? (
                <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "5rem 2rem", textAlign: "center", border: "1px dashed #e5e7eb" }}>
                    <h2>No tienes transferencias pendientes</h2>
                    <p style={{ color: "#6b7280" }}>Cuando confirmes un servicio, aparecerá aquí.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                                <th style={{ padding: "1.25rem 1rem", textAlign: "left", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>Pago ID</th>
                                <th style={{ padding: "1.25rem 1rem", textAlign: "left", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>Monto</th>
                                <th style={{ padding: "1.25rem 1rem", textAlign: "left", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>Titular</th>
                                <th style={{ padding: "1.25rem 1rem", textAlign: "left", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>Banco</th>
                                <th style={{ padding: "1.25rem 1rem", textAlign: "left", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>Fecha</th>
                                <th style={{ padding: "1.25rem 1rem", textAlign: "center", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>Estado</th>
                                <th style={{ padding: "1.25rem 1rem", textAlign: "center", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transferencias.map((t) => (
                                <tr key={t.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                                    <td style={{ padding: "1.25rem 1rem", fontFamily: "monospace", fontWeight: 600 }}>{t.pagoID}</td>
                                    <td style={{ padding: "1.25rem 1rem", fontWeight: 700 }}>${Number(t.monto).toLocaleString("es-CO")}</td>
                                    <td style={{ padding: "1.25rem 1rem" }}>{t.titular}</td>
                                    <td style={{ padding: "1.25rem 1rem" }}>{t.banco}</td>
                                    <td style={{ padding: "1.25rem 1rem" }}>{new Date(t.createdAt).toLocaleDateString("es-CO")}</td>
                                    <td style={{ padding: "1.25rem 1rem" }}>
                                        <PaymentStatusBadge status={t.estado} />
                                    </td>
                                    <td style={{ padding: "1.25rem 1rem", textAlign: "center" }}>
                                        <button
                                            onClick={() => setSelectedTransferencia(t)}
                                            style={{ color: "#2563eb", fontWeight: 600, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                                        >
                                            Ver detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de Detalle */}
            <Dialog open={!!selectedTransferencia} onClose={() => setSelectedTransferencia(null)} style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
                <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.75)", padding: "20px" }}>
                    <div style={{ backgroundColor: "white", width: "100%", maxWidth: "720px", borderRadius: "24px", overflow: "hidden" }}>
                        {selectedTransferencia && (
                            <TransferenciaCard 
                                transferencia={selectedTransferencia} 
                                onMarcarTransferido={handleMarcarTransferido} 
                            />
                        )}
                        <div style={{ padding: "1.5rem", textAlign: "center", borderTop: "1px solid #e5e7eb" }}>
                            <button 
                                onClick={() => setSelectedTransferencia(null)}
                                style={{ color: "#2563eb", fontWeight: 600 }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}