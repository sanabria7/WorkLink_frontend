import type { PaymentSession } from "../types/pagosTypes";

const PAYMENT_HISTORY_KEY = "worklink:payment-history";

function safeParse(raw: string | null): PaymentSession[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed as PaymentSession[];
    } catch {
        return [];
    }
}

export function loadPaymentSessions(): PaymentSession[] {
    if (typeof window === "undefined") return [];
    return safeParse(window.localStorage.getItem(PAYMENT_HISTORY_KEY));
}

export function savePaymentSession(session: PaymentSession): PaymentSession[] {
    if (typeof window === "undefined") return [];

    const current = loadPaymentSessions();
    const id = session.pago.pagoID || session.pago.tokenConfirmacion || session.createdAt;

    const next = [
        session,
        ...current.filter((item) => {
            const itemId = item.pago.pagoID || item.pago.tokenConfirmacion || item.createdAt;
            return itemId !== id;
        }),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    window.localStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(next));
    return next;
}

export function clearPaymentSessions(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(PAYMENT_HISTORY_KEY);
}