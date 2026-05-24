import { useMemo, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import * as pagosService from "../api/pagosService";
import * as reservasService from "../api/reservasService";
import * as horariosService from "../api/horariosService";
import type { MetodoPago, PagoRequest, PagoResponse } from "../types/pagosTypes";
import type { CrearReservaDTO, ReservaResponse } from "../types/reservaTypes";
import type { ProfileCliente } from "../types/userTypes";
import type { CheckoutLocationState } from "../types/checkoutTypes";

interface UseCheckoutProps {
    state: CheckoutLocationState;
    perfilCliente: ProfileCliente;
}

export function useCheckout({ state, perfilCliente }: UseCheckoutProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [metodoPago, setMetodoPago] = useState<MetodoPago>("TARJETA");
    const [resultadoPago, setResultadoPago] = useState<PagoResponse | null>(null);
    const [reservaCreada, setReservaCreada] = useState<ReservaResponse | null>(null);

    const clienteId = useMemo(() => {
        const id = perfilCliente?.id ?? state.reserva.clienteId;
        const parsed = Number(id);
        return Number.isFinite(parsed) ? parsed : null;
    }, [perfilCliente?.id, state.reserva.clienteId]);

    async function confirmarPago() {
        setError(null);

        if (loading) return;

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

                const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({ type: "card", card: cardElement });
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
                monto: state.reserva.precio,
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
                await horariosService.reservarSlots({ idsSlots: state.idsSlots, codigoReserva: reserva.reservaDTO.idReserva });
            }
        } catch (err: any) {
            console.error("Error procesando checkout:", err);
            setError(err?.response?.data?.mensaje || "No se pudo completar el pago.");
        } finally {
            setLoading(false);
        }
    }
    return {
        metodoPago,
        setMetodoPago,
        loading,
        error,
        resultadoPago,
        reservaCreada,
        confirmarPago,
    };
}