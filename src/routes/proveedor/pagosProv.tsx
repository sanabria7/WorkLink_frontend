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

export default function MisPagosProveedor() {
    const { perfilProveedor } = useAuth();

    const [transferencias, setTransferencias] = useState<TransferenciaPendiente[]>([]);
    const [tokenConfirmacion, setTokenConfirmacion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ultimaRespuesta, setUltimaRespuesta] = useState<TransferenciaResponse | null>(null);
    const [tieneCuentaBancaria, setTieneCuentaBancaria] = useState<boolean | null>(null);

    const proveedorId = perfilProveedor?.id ? Number(perfilProveedor.id) : null;

    const cargarTransferencias = async () => {
        if (!proveedorId) return;
        setLoading(true);
        try {
            const data = await getTransferenciasPendientes();
            const filtradas = data.filter((t) => Number(t.proveedorID) === proveedorId);
            console.log(`[CARGAR] Transferencias cargadas: ${filtradas.length}`, filtradas);
            setTransferencias(filtradas);
        } catch (err) {
            console.error("Error cargando transferencias:", err);
            setError("No se pudieron cargar las transferencias pendientes.");
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
        } catch (error) {
            setTieneCuentaBancaria(false);
        }
    }

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
        if (!proveedorId) return;
        if (!tokenConfirmacion.trim()) {
            setError("Escribe el token de confirmación.");
            return;
        }
        console.log(`[CONFIRMAR] Intentando confirmar token: ${tokenConfirmacion.trim()}`);
        try {
            setLoading(true);
            setError(null);
            const response = await confirmarPagoConToken(tokenConfirmacion.trim().toUpperCase(), proveedorId);
            console.log("[CONFIRMAR] respuesta exitosa:", response);
            setUltimaRespuesta(response);
            setTokenConfirmacion("");
            alert("Servicio confirmado exitosamente. Pago liberado y transferencia creada");
            await cargarTransferencias();
        } catch (err: any) {
            console.error("Error confirmando pago:", err);
            setError(err?.response?.data?.mensaje || err?.response?.data || err?.message || "No se pudo confirmar el cobro.");
        } finally {
            setLoading(false);
        }
    };

    const handleMarcarTransferido = async (id: string) => {
        console.log(`[TRANSFERIDO] Solicitud para marcar ID: ${id}`);

        const confirmar = window.confirm(
            "¿Estás seguro de que ya realizaste la transferencia bancaria?\n\nEsta acción no se puede deshacer."
        );

        if (!confirmar) {
            console.log("[TRANSFERIDO] Acción cancelada por el usuario.");
            return;
        }
        try {
            console.log(`[TRANSFERIDO] Ejecutando llamada al backend para ID: ${id}`);
            await marcarTransferido(id);
            console.log(`[TRANSFERIDO] Transferencia ${id} marcada como TRANSFERIDO exitosamente`);
            alert("Transferencia marcada como realizada");
            cargarTransferencias();
        } catch (error) {
            console.log("error al actualizar transferencia:", error);
        }
    };

    if (loading) { return <div style={{ padding: "3rem", textAlign: "center" }}>Cargando transferencias pendientes...</div>; }

    if (!perfilProveedor?.id) {
        return <div style={{ padding: "3rem", textAlign: "center" }}>No se pudo identificar tu perfil.</div>;
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1240px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800 }}>Mis pagos</h1>
                    <p style={{ margin: "0.35rem 0 0 0", color: "#6b7280" }}>Tokeniza, confirma y revisa tus transferencias pendientes.</p>
                </div>
            </div>

            {tieneCuentaBancaria === false ? (
                <div style={{ backgroundColor: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "20px", padding: "1.75rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ fontSize: "2.2rem" }}><Icon name="error" /></div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 0.5rem 0", color: "#92400e" }}>Cuenta bancaria requerida</h3>
                        <p style={{ margin: 0, color: "#b45309" }}>Debes configurar tu cuenta bancaria antes de poder recibir pagos.</p>
                    </div>
                    <Link
                        to="/configurar-cuenta-bancaria"
                        style={{ backgroundColor: "#d97706", color: "white", padding: "0.85rem 1.75rem", borderRadius: "12px", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}
                    >
                        Configurar Cuenta
                    </Link>
                </div>
            ) : (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                        <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "24px", padding: "1rem" }}>
                            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>Transferencias pendientes</p>
                            <strong style={{ fontSize: "1.7rem" }}>{totals.count}</strong>
                        </div>
                        <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "24px", padding: "1rem" }}>
                            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>Monto en cola</p>
                            <strong style={{ fontSize: "1.7rem" }}>${totals.amount.toLocaleString("es-CO")}</strong>
                        </div>
                        <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "24px", padding: "1rem" }}>
                            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>Estado general</p>
                            <PaymentStatusBadge status={transferencias.length > 0 ? "PENDIENTE" : "TRANSFERIDO"} />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem" }}>
                        <ConfirmTokenPanel
                            tokenConfirmacion={tokenConfirmacion}
                            setTokenConfirmacion={setTokenConfirmacion}
                            proveedorId={proveedorId}
                            loading={loading}
                            response={ultimaRespuesta}
                            onConfirm={handleConfirmar}
                        />
                        {error && (
                            <div style={{ display: "flex", alignItems: "center" ,backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: "20px", padding: "1rem" }}>
                                <Icon name="error" />{error}
                            </div>
                        )}
                    </div>
                </>
            )}

            {transferencias.length === 0 ? (
                <div style={{ backgroundColor: "white", borderRadius: "24px", border: "1px dashed #d1d5db", padding: "3rem", textAlign: "center" }}>
                    <h2 style={{ marginTop: 0 }}>No tienes transferencias pendientes</h2>
                    <p style={{ color: "#6b7280" }}>Cuando confirmes un token de pago, la transferencia pendiente aparecerá aquí con los datos bancarios del cliente.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {transferencias.map((transferencia) => (
                        <TransferenciaCard key={transferencia.id} transferencia={transferencia} onMarcarTransferido={handleMarcarTransferido} />
                    ))}
                </div>
            )}
        </div>
    );
}