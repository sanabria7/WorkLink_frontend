import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutReservationCard from "../../components/checkout/reservationCard";
import PaymentMethodSelector from "../../components/checkout/paymentMethodSelector";
import CheckoutSideBar from "../../components/checkout/checkoutSidebar";
import CheckoutSuccess from "../../components/checkout/checkoutSuccess";
import CheckoutUnavailable from "../../components/checkout/checkoutUnavailable";
import { useCheckout } from "../../hooks/useCheckout";
import { savePaymentSession } from "../../utils/paymentStorage";
import type { CheckoutLocationState } from "../../types/checkoutTypes";
import Icon from "../../components/misc/icon";

const stripePromise = loadStripe("pk_test_51TUub07VXPEXRAaZoDnAgkPZRulhGacTiNB3KljwY5Op0KvBrzOkCRc9XbUIHRmGnm0UtsaUHq88uBKGxscZt6iA00gusQownh");

function CheckoutPageContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { perfilCliente, authLoading } = useAuth();
    const state = location.state as CheckoutLocationState | undefined;
    
    useEffect(() => {
        if (authLoading) return;
        if (!state) {
            navigate("/home", { replace: true });
        }
    }, [authLoading, navigate, state]);    
    
    if (!state || !perfilCliente) {
        return <CheckoutUnavailable />
    }
    
    const { metodoPago, setMetodoPago, loading, error, resultadoPago, reservaCreada, confirmarPago } = useCheckout({state, perfilCliente});

    useEffect(() => {
        if (!resultadoPago || !reservaCreada?.exito) return;

        savePaymentSession({
            pago: resultadoPago,
            reserva: state.reserva,
            servicio: state.servicio,
            idsSlots: state.idsSlots,
            createdAt: new Date().toISOString(),
        });
    }, [resultadoPago, reservaCreada, state]);
    
    async function handleConfirmarPago(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        await confirmarPago();
    }
    
    if (resultadoPago && reservaCreada?.exito) {
        return (
            <CheckoutSuccess
                resultadoPago={resultadoPago}
                reservaCreada={reservaCreada}
                servicio={state.servicio}
                onGoPagos={() => navigate("/mis-pagos", {replace: true})}
                onBackServicios={() => navigate(`/servicio/${state.servicio.id}`)}
            />
        );
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1240px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700 }}>Confirma tu reserva y pago</h1>
                    <p style={{ margin: "0.35rem 0 0 0", color: "#6b7280" }}>Revisa los detalles, elige el método de pago y finaliza tu reserva.</p>
                </div>
                <button onClick={() => navigate(`/servicio/${state.servicio.id}`)} style={{ border: "1px solid #d1d5db", fontSize: "1rem", backgroundColor: "white", borderRadius: "12px", padding: "0.85rem 1rem", cursor: "pointer", fontWeight: 600 }}>
                    Volver al servicio
                </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.9fr)", gap: "1.5rem", alignItems: "start" }}>
                <form onSubmit={handleConfirmarPago} style={{ backgroundColor: "white", borderRadius: "28px", border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 6px 24px rgba(0,0,0,0.05)" }}>                   
                    <CheckoutReservationCard servicio={state.servicio} reserva={state.reserva} />
                    <PaymentMethodSelector metodoPago={metodoPago} setMetodoPago={setMetodoPago} />
                    {error && (
                        <div style={{ display:"flex", alignItems:"center", marginBottom: "1rem", borderRadius: "16px", padding: "1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}>
                            <Icon name="error"/> {error}
                        </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "end", gap: "0.8rem", flexWrap: "wrap" }}>
                        <button type="button" onClick={() => navigate(`/servicio/${state.servicio.id}`)} style={{ border: "none", borderRadius: "16px", fontSize: "1rem", backgroundColor: "rgba(0,0,0,0.07)", color: "#111827", padding: "0.9rem 1.2rem", cursor: "pointer", fontWeight: 600 }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} style={{ border: "none", backgroundColor: loading ? "#93c5fd" : "#2563eb", fontSize: "1rem", color: "white", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700 }}>
                            {loading ? "Procesando pago..." : "Pagar y confirmar reserva"}
                        </button>
                    </div>
                </form>
                <CheckoutSideBar servicio={state.servicio} reserva={state.reserva} />                
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPageContent />
        </Elements>
    )
}