import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authProvider";
import CuentaBancariaForm from "../payments/cuentaBancariaForm";
import * as profilesService from "../../api/profilesService";

export default function ConfigurarCuentaBancaria() {
    const { perfilProveedor } = useAuth();
    const [tieneCuenta, setTieneCuenta] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    const proveedorID = perfilProveedor?.id;

    useEffect(() => {
        if (!proveedorID) return;
        verificarCuentaBancaria();
    }, [proveedorID]);

    const verificarCuentaBancaria = async () => {
        if(!proveedorID) return;
        setLoading(true);
        try {
            const data = await profilesService.obtenerCuentaBancaria(proveedorID);
            setTieneCuenta(!!data?.cuentaVinculada);
        } catch {
            setTieneCuenta(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        setTieneCuenta(true);
        setTimeout(() => {
            window.location.href = "/gestion-pagos";
        }, 1800);
    };

    if (loading) {
        return <div style={{ padding: "4rem", textAlign: "center" }}>Verificando información bancaria...</div>;
    }

    if (tieneCuenta) {
        return (
            <div style={{ padding: "3rem", textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>¡Tu cuenta ya está configurada!</h1>
                <p style={{ color: "#6b7280", marginTop: "1rem" }}>Serás redirigido a Mis Pagos...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "2.5rem", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <h1 style={{ fontSize: "2.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>Configura tu Cuenta Bancaria</h1>
                <p style={{ color: "#6b7280", fontSize: "1.05rem" }}>
                    Para poder recibir tus pagos de WorkLink, es obligatorio registrar una cuenta bancaria colombiana.
                </p>
            </div>

            <CuentaBancariaForm 
                proveedorID={proveedorID!} 
                onSuccess={handleSuccess} 
            />
        </div>
    );
}