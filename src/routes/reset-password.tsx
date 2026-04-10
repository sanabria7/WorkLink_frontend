import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authService";
import { isAxiosError } from "axios";
import { mapGlobalErrors } from "../utils/mapGlobalErrors";
import { mapValidationErrors } from "../utils/mapValidationErrors";
import Icon from "../components/misc/icon";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const tokenFromQuery = searchParams.get("token") ?? "";
    const [token, setToken] = useState<string>(tokenFromQuery);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [mensaje, setMensaje] = useState<string | null>(null);
    const [errorResponse, setErrorResponse] = useState<Record<string, string>>({});


    useEffect(() => {
        if (tokenFromQuery) setToken(tokenFromQuery)
    }, [tokenFromQuery]);

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        setErrorResponse({});
        setMensaje(null);
        if (!password || !confirm) {
            setErrorResponse({ general: "Ambos campos de contraseña son obligatorios" });
            return;
        }
        if (password !== confirm) {
            setErrorResponse({ general: "Las contraseñas no coinciden" });
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword({ token, password });
            setMensaje(response);
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 3000);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                console.log("Error recibido:", error.response?.data);
                if (error.response?.status === 400 && typeof error.response.data === "object") {
                    console.log("entro");
                    setErrorResponse(mapValidationErrors(error.response.data));
                } else {
                    setErrorResponse({ general: mapGlobalErrors(error) });
                }
            } else if (error instanceof Error) {
                setErrorResponse({ general: error.message });
            } else {
                setErrorResponse({ general: "Error desconocido" });
            }
        } finally {
            setLoading(false);

        }

    }

    return (
        <form className="form" onSubmit={handleSubmit} aria-describedby="reset-error">
            <h1>Restablecer contraseña</h1>
            {mensaje && <div role="status" className="infoMessage">{mensaje}</div>}
            {errorResponse && 
            <div id="reset-error" role="alert" className="errorMessage">
                <Icon name="error"/>
                {errorResponse.general}
                </div>}
            {!token && (
                <>
                    <label htmlFor="token">Token</label>
                    <input id="token"
                        name="token"
                        value={token ?? ""}
                        onChange={(evento) => setToken(evento.target.value)}
                        required />
                    <small>Introduce el código que te enviamos por correo</small>
                </>
            )}
            <label htmlFor="password">Introduce la nueva contraseña</label>
            <input id="password"
                name="password"
                type="password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                required />
            <label htmlFor="confirm">Confirma la nueva contraseña</label>
            <input id="confirm"
                name="confirm"
                type="password"
                value={confirm}
                onChange={(evento) => setConfirm(evento.target.value)}
                required />
            <button type="submit" disabled={loading} aria-busy={loading}>
                {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
        </form>
    );
}