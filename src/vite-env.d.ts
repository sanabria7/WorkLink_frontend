/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_GATEWAY_URL: string;
    readonly VITE_API_AUTH_URL: string;
    readonly VITE_API_PROFILES_URL: string;
    readonly VITE_API_OFFER_URL: string;
    readonly VITE_API_RESERVAS_URL: string;
    readonly VITE_API_PAGOS_URL: string;
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
