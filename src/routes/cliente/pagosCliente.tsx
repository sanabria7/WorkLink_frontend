import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import * as pagosService from "../../api/pagosService";
import PaymentSessionCard from "../../components/payments/paymentSessionCard";
import { Dialog } from "@headlessui/react";
import Icon from "../../components/misc/icon";
import type { PagoResponse } from "../../types/pagosTypes";

export default function MisPagosCliente() {
    const navigate = useNavigate();
    const { perfilCliente } = useAuth();
    const [pagos, setPagos] = useState<PagoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPago, setSelectedPago] = useState<PagoResponse | null>(null);

    const cargarPagos = async () => {
        if (!perfilCliente?.id) return;
        setLoading(true);
        try {
            const data = await pagosService.obtenerPagosPorCliente(perfilCliente?.id);
            setPagos(data);
        } catch (error) {
            console.error("Error cargando pagos de cliente:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarPagos();
    }, [perfilCliente?.id]);

    if (loading) { return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando tus pagos...</div> }

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

            {pagos.length === 0 ? (
                <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "5rem 2rem", textAlign: "center", border: "1px dashed #e5e7eb" }}>
                    <svg style={{ fontSize: "4rem", opacity: 0.4 }}><Icon name="info" /></svg>
                    <h2 style={{ marginTop: "1.5rem" }}>Aún no tienes pagos</h2>
                    <p style={{ color: "#6b7280", maxWidth: "420px", margin: "1rem auto 0" }}>Cuando completes una reserva aparecerá aquí.</p>
                </div>
            ) : (
                <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                                <th style={{ padding: "1.25rem 1rem", textAlign: "left", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>SERVICIO</th>
                                {/* <th style={{ padding: "1.25rem 1rem", textAlign: "left", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>FECHA</th> */}
                                <th style={{ padding: "1.25rem 1rem", textAlign: "left", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>MONTO</th>
                                <th style={{ padding: "1.25rem 1rem", textAlign: "left", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>ESTADO</th>
                                <th style={{ padding: "1.25rem 1rem", textAlign: "center", fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagos.map((pago) => (
                                <tr key={pago.pagoID} style={{ borderTop: "1px solid #f3f4f6", transition: "background-color 0.2s" }} className="hover:bg-gray-50">
                                    <td style={{ padding: "1.25rem 1rem", fontWeight: 600 }}>Servicio #{pago.servicioID}</td>
                                    {/* <td style={{ padding: "1.25rem 1rem" }}>{pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString("es-CO") : "-"}</td> */}
                                    <td style={{ padding: "1.25rem 1rem", fontWeight: 700 }}>${Number(pago.monto || 0).toLocaleString("es-CO")}</td>
                                    <td style={{ padding: "1.25rem 1rem" }}>
                                        <span style={{
                                            padding: "6px 16px",
                                            borderRadius: "999px",
                                            fontSize: "0.85rem",
                                            fontWeight: 600,
                                            backgroundColor: pago.estadoPago === "RETENIDO" ? "#fef3c7" : pago.estadoPago === "EXITOSO" ? "#dcfce7" : "#f3e8ff",
                                            color: pago.estadoPago === "RETENIDO" ? "#92400e" : pago.estadoPago === "EXITOSO" ? "#15803d" : "#6b21a8"
                                        }}>
                                            {pago.estadoPago}
                                        </span>
                                    </td>
                                    <td style={{ padding: "1.25rem 1rem", textAlign: "center" }}>
                                        <button
                                            onClick={() => setSelectedPago(pago)}
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

            <Dialog open={!!selectedPago} onClose={() => setSelectedPago(null)} style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
                <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.75)", padding: "20px" }}>
                    <div style={{ backgroundColor: "white", width: "100%", maxWidth: "720px", borderRadius: "24px", overflow: "hidden" }}>
                        {selectedPago && <PaymentSessionCard session={{ pago: selectedPago }} />}
                        <div style={{ padding: "1.25rem", textAlign: "center", borderTop: "1px solid #e5e7eb" }}>
                            <button onClick={() => setSelectedPago(null)} style={{ padding: "8px", borderRadius: "12px", width:"100%", fontWeight:600,fontSize: "0.9rem", border: "1px solid #d1d5db", cursor: "pointer" }}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}