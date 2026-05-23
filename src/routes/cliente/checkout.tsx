import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import * as pagosService from "../../api/pagosService";
import * as reservasService from "../../api/reservasService";
import * as horariosService from "../../api/horariosService";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import StripeCardForm from "../../components/checkout/stripeCardForm";
import type { profilesService } from "../../types/serviceTypes";
import type { CrearReservaDTO, ReservaResponse } from "../../types/reservaTypes";
import type { MetodoPago, PagoRequest, PagoResponse } from "../../types/pagosTypes";
import Icon from "../../components/misc/icon";
import { isAxiosError } from "axios";
import { mapGlobalErrors } from "../../utils/mapGlobalErrors";
import { mapValidationErrors } from "../../utils/mapValidationErrors";

interface CheckoutLocationState {
    servicio: profilesService;
    reserva: CrearReservaDTO;
    idsSlots: number[];
}

const stripePromise = loadStripe("pk_test_51TUub07VXPEXRAaZoDnAgkPZRulhGacTiNB3KljwY5Op0KvBrzOkCRc9XbUIHRmGnm0UtsaUHq88uBKGxscZt6iA00gusQownh");

function formatFechaBonita(fecha: string) {
    const fechaDate = new Date(`${fecha}T00:00:00`);
    return new Intl.DateTimeFormat("es-CO", { dateStyle: "full" }).format(fechaDate);
}

function formatHoraBonita(raw: string) {
    const fecha = new Date(`1970-01-01T${raw}`);
    return new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit", hour12: true }).format(fecha).replace("a. m.", "a. m.").replace("p. m.", "p. m.");
}

function formatRangoBonito(rango: string) {
    const partes = rango.split(" - ");
    if (partes.length !== 2) return rango;
    return `${formatHoraBonita(partes[0])} - ${formatHoraBonita(partes[1])}`;
}

function CheckoutPageInner() {
    const navigate = useNavigate();
    const location = useLocation();
    const stripe = useStripe();
    const elements = useElements();

    const { perfilCliente, authLoading } = useAuth();

    const state = location.state as CheckoutLocationState | null;

    const [metodoPago, setMetodoPago] = useState<MetodoPago>("TARJETA");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultadoPago, setResultadoPago] = useState<PagoResponse | null>(null);
    const [reservaCreada, setReservaCreada] = useState<ReservaResponse | null>(null);

    const clienteId = useMemo(() => {
        const id = perfilCliente?.id ?? state?.reserva.clienteId;
        const parsed = Number(id);
        return Number.isFinite(parsed) ? parsed : null;
    }, [perfilCliente?.id, state?.reserva.clienteId]);

    useEffect(() => {
        if (authLoading) return;
        if (!state) {
            navigate("/home", { replace: true });
        }
    }, [authLoading, navigate, state]);

    async function handleConfirmarPago(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        setError(null);

        if (loading) return;

        if (!state) {
            setError("No se encontró la información de la reserva.");
            return;
        }

        if (!clienteId) {
            setError("No se pudo identificar el cliente autenticado.");
            return;
        }

        try {
            setLoading(true);
            console.log("INICIANDO TOKENIZACION STRIPE");
            let tarjetaPayload = undefined;

            if (metodoPago === "TARJETA") {
                if (!stripe || !elements) {
                    setError("Stripe todavía no ha cargado.");
                    return;
                }

                const cardElement = elements.getElement(CardElement);

                if (!cardElement) {
                    setError("No se encontró el formulario de tarjeta.");
                    return;
                }

                const { error: stripeError, paymentMethod } =
                    await stripe.createPaymentMethod({ type: "card", card: cardElement });
                console.log("RESPUESTA STRIPE:", { stripeError, paymentMethod, });

                if (stripeError) {
                    setError(stripeError.message || "Error procesando tarjeta.");
                    return;
                }
                if (!paymentMethod) {
                    setError("Stripe no retornó paymentMethod.");
                    return;
                }

                console.log("PAYMENT METHOD EXITOSO:", paymentMethod);
                tarjetaPayload = {
                    tokenTarjeta: paymentMethod.id,
                    ultimos4: paymentMethod.card?.last4 || "",
                    marcaTarjeta: paymentMethod.card?.brand || "",
                };
                console.log("TARJETA PAYLOAD:", tarjetaPayload);
            }
            const pagoRequest: PagoRequest = {
                clienteID: clienteId,
                servicioID: Number(state.reserva.servicioId),
                monto: state?.reserva.precio,
                metodoPago,
                ...(metodoPago === "TARJETA"
                    ? {
                        tarjeta: tarjetaPayload,
                    }
                    : {}),
            };
            console.log("PAYLOAD FINAL ENVIADO AL BACKEND:", pagoRequest);
            const pago = await pagosService.realizarPago(pagoRequest);
            setResultadoPago(pago);
            console.log("RESPUESTA BACKEND PAGO:", pago)
            const reservaPayload: CrearReservaDTO = {
                ...state.reserva,
                clienteId: String(clienteId),
                totalPagado: state.reserva.precio,
                esPagada: true,
            };
            const reserva = await reservasService.crearReserva(reservaPayload);
            setReservaCreada(reserva);
            if (!reserva.exito || !reserva.reservaDTO?.idReserva) {
                throw new Error(reserva.mensaje || "No se pudo crear la reserva.");
            }
            if (state.idsSlots?.length > 0) {
                await horariosService.reservarSlots({
                    idsSlots: state.idsSlots,
                    codigoReserva: reserva.reservaDTO.idReserva,
                });
            }
        } catch (err: any) {
            console.error("Error procesando checkout:", err);
            setError( err?.response?.data?.mensaje || "No se pudo completar el pago." );
        } finally {
            setLoading(false);
        }
    }

    if (!state) {
        return (
            <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
                <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "24px", padding: "2rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>Checkout no disponible</h1>
                    <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>No hay datos de reserva para procesar el pago.</p>
                    <button onClick={() => navigate("/home", { replace: true })} style={{ border: "none", backgroundColor: "#2563eb", color: "white", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: "pointer", fontWeight: 600 }}>
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    if (resultadoPago && reservaCreada?.exito) {
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
                            <p style={{ margin: 0, fontWeight: 600 }}>{state.servicio.titulo}</p>
                        </div>
                        <div style={{ backgroundColor: "#f9fafb", borderRadius: "18px", padding: "1rem", border: "1px solid #e5e7eb" }}>
                            <p style={{ margin: "0 0 0.35rem 0", color: "#6b7280", fontSize: "0.9rem" }}>Reserva</p>
                            <p style={{ margin: 0, fontWeight: 600 }}>{reservaCreada.reservaDTO?.idReserva}</p>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                        <button onClick={() => navigate("/mis-reservas", { replace: true })} style={{ border: "none", backgroundColor: "#2563eb", color: "white", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: "pointer", fontWeight: 600 }}>
                            Ir a mis reservas
                        </button>
                        <button onClick={() => navigate(`/servicio/${state.servicio.id}`)} style={{ border: "1px solid #d1d5db", backgroundColor: "white", color: "#111827", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: "pointer", fontWeight: 600 }}>
                            Volver al servicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1240px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700 }}>Confirma tu reserva y pago</h1>
                    <p style={{ margin: "0.35rem 0 0 0", color: "#6b7280" }}>Revisa los detalles, elige el método de pago y finaliza tu reserva.</p>
                </div>
                <button onClick={() => navigate(`/servicio/${state.servicio.id}`)} style={{ border: "1px solid #d1d5db", backgroundColor: "white", borderRadius: "12px", padding: "0.85rem 1rem", cursor: "pointer", fontWeight: 600 }}>
                    Volver al servicio
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.9fr)", gap: "1.5rem", alignItems: "start" }}>
                <form onSubmit={handleConfirmarPago} style={{ backgroundColor: "white", borderRadius: "28px", border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 6px 24px rgba(0,0,0,0.05)" }}>
                    <section style={{ marginBottom: "1.5rem" }}>
                        <h2 style={{ margin: "0 0 0.8rem 0", fontSize: "1.15rem", fontWeight: 700 }}>Tu reserva</h2>
                        <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "1rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>{state.servicio.titulo}</p>
                            <p style={{ margin: 0, color: "#6b7280" }}>{state.servicio.proveedor.usuario.nombre} {state.servicio.proveedor.usuario.apellido}</p>
                            <p style={{ margin: 0, color: "#6b7280" }}>{formatFechaBonita(state.reserva.fechaReserva)}</p>
                            <p style={{ margin: 0, color: "#6b7280" }}>{formatRangoBonito(state.reserva.rangoTiempoReservado)}</p>
                        </div>
                    </section>

                    <section style={{ marginBottom: "1.5rem" }}>
                        <h2 style={{ margin: "0 0 0.8rem 0", fontSize: "1.15rem", fontWeight: 700 }}>Método de pago</h2>
                        <p style={{ margin: "0 0 1rem 0", color: "#6b7280" }}>El backend ya contempla tarjeta, PSE y efectivo. Por ahora la tarjeta es la opción con más detalle visual; las otras se conservan listas para extender la UI.</p>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                            {(["TARJETA", "PSE", "EFECTIVO"] as MetodoPago[]).map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMetodoPago(m)}
                                    style={{
                                        border: metodoPago === m ? "2px solid #2563eb" : "1px solid #d1d5db",
                                        backgroundColor: metodoPago === m ? "#eff6ff" : "white",
                                        borderRadius: "16px",
                                        padding: "0.9rem",
                                        cursor: "pointer",
                                        fontWeight: 700
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        {metodoPago === "TARJETA" && (
                            <StripeCardForm />
                        )}
                    </section>

                    {error && (
                        <div style={{ marginBottom: "1rem", borderRadius: "16px", padding: "1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "end", gap: "0.8rem", flexWrap: "wrap" }}>
                        <button type="button" onClick={() => navigate(`/servicio/${state.servicio.id}`)} style={{ border: "1px solid #d1d5db", backgroundColor: "white", color: "#111827", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: "pointer", fontWeight: 600 }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} style={{ border: "none", backgroundColor: loading ? "#93c5fd" : "#2563eb", color: "white", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700 }}>
                            {loading ? "Procesando..." : "Pagar y confirmar reserva"}
                        </button>
                    </div>
                </form>

                <aside style={{ position: "sticky", top: "1.25rem", backgroundColor: "white", borderRadius: "28px", border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 6px 24px rgba(0,0,0,0.05)" }}>
                    <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.15rem", fontWeight: 700 }}>Resumen de cobro</h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                            <span style={{ color: "#6b7280" }}>Servicio</span>
                            <strong style={{ textAlign: "right" }}>{state.servicio.titulo}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                            <span style={{ color: "#6b7280" }}>Proveedor</span>
                            <strong style={{ textAlign: "right" }}>{state.servicio.proveedor.usuario.nombre} {state.servicio.proveedor.usuario.apellido}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                            <span style={{ color: "#6b7280" }}>Fecha</span>
                            <strong style={{ textAlign: "right" }}>{formatFechaBonita(state.reserva.fechaReserva)}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                            <span style={{ color: "#6b7280" }}>Horario</span>
                            <strong style={{ textAlign: "right" }}>{formatRangoBonito(state.reserva.rangoTiempoReservado)}</strong>
                        </div>

                        <div style={{ borderTop: "1px solid #e5e7eb", margin: "0.5rem 0" }} />

                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                            <span style={{ color: "#6b7280" }}>Precio</span>
                            <strong>${state.reserva.precio.toLocaleString("es-CO")}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                            <span style={{ color: "#6b7280" }}>Comisión WorkLink (10%)</span>
                            <strong>${Math.round(state?.reserva.precio * 0.1).toLocaleString("es-CO")}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "1.05rem" }}>
                            <span style={{ fontWeight: 700 }}>Total</span>
                            <strong>${state?.reserva.precio.toLocaleString("es-CO")}</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPageInner />
        </Elements>
    )
}