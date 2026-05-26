import { useState } from "react";
import * as profilesService from "../../api/profilesService";
import type { CuentaBancariaRequest } from "../../types/pagosTypes";
import Icon from "../misc/icon";

interface Props {
    proveedorID: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const bancosColombia = [
    "Bancolombia", "Davivienda", "Banco Bogotá", "BBVA", 
    "Nequi", "DaviPlata", "Banco Popular", "Scotiabank", "Colpatria"
];

export default function CuentaBancariaForm({ proveedorID, onSuccess, onCancel }: Props) {
    const [form, setForm] = useState<CuentaBancariaRequest>({
        titular: "",
        numeroCuenta: "",
        tipoCuenta: "AHORROS",
        banco: "",
        documento: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (field: keyof CuentaBancariaRequest, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await profilesService.guardarCuentaBancaria(proveedorID, form);
            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al guardar la cuenta bancaria. Verifica los datos.");
            console.error("Error guardando cuenta bancaria:", err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ textAlign: "center", padding: "3rem 2rem", backgroundColor: "white", borderRadius: "24px", border: "1px solid #86efac" }}>
                <Icon name="success" />
                <h2 style={{ color: "#15803d", margin: "1rem 0" }}>¡Cuenta Bancaria Configurada!</h2>
                <p style={{ color: "#166534" }}>Ahora podrás recibir tus pagos de forma automática.</p>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "2.25rem", border: "1px solid #e5e7eb", maxWidth: "680px", margin: "0 auto" }}>
            <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", fontWeight: 700 }}>Configura tu Cuenta Bancaria</h2>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
                Esta información es obligatoria para recibir tus pagos de WorkLink.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Titular de la cuenta</label>
                    <input
                        type="text"
                        value={form.titular}
                        onChange={(e) => handleChange("titular", e.target.value)}
                        style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "1rem" }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Número de cuenta</label>
                    <input
                        type="text"
                        value={form.numeroCuenta}
                        onChange={(e) => handleChange("numeroCuenta", e.target.value)}
                        style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "1rem" }}
                        required
                    />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Tipo de cuenta</label>
                        <select
                            value={form.tipoCuenta}
                            onChange={(e) => handleChange("tipoCuenta", e.target.value as "AHORROS" | "CORRIENTE")}
                            style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid #d1d5db" }}
                            required
                        >
                            <option value="" disabled hidden>-- Selecciona un tipo de cuenta --</option>
                            <option value="AHORROS">Ahorros</option>
                            <option value="CORRIENTE">Corriente</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Banco</label>
                        <select
                            value={form.banco}
                            onChange={(e) => handleChange("banco", e.target.value)}
                            style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid #d1d5db" }}
                            required
                        >
                            <option value="" disabled hidden>-- Selecciona tu cuenta de banco --</option>
                            {bancosColombia.map(b => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Documento (Cédula)</label>
                    <input
                        type="text"
                        value={form.documento}
                        onChange={(e) => handleChange("documento", e.target.value)}
                        style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "1rem" }}
                        required
                    />
                </div>

                {error && (
                    <div style={{ color: "#ef4444", backgroundColor: "#fef2f2", padding: "1rem", borderRadius: "12px", border: "1px solid #fecaca" }}>
                        {error}
                    </div>
                )}

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ flex: 1, padding: "1.1rem", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "14px", fontWeight: 600, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        {loading ? "Guardando cuenta..." : "Guardar Cuenta Bancaria"}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{ flex: 1, padding: "1.1rem", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "14px", fontSize: "1rem", fontWeight: 600 }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}