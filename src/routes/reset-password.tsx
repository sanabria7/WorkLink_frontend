import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authService";
import { isAxiosError } from "axios";
import { mapAuthError } from "../utils/mapAuthError";

const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const tokenFromQuery = searchParams.get("token") ?? null;
    const [token, setToken] = useState(tokenFromQuery);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [mensaje, setMensaje] = useState<string | null>(null);
    const [errorResponse, setErrorResponse] = useState<string | null>(null);

    useEffect(() => {
        if (tokenFromQuery) setToken(tokenFromQuery)
    }, [tokenFromQuery]);

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        setErrorResponse(null);
        setMensaje(null);
        if (!token) {
            setErrorResponse("Token de recuperación faltante o vencido");
            return;
        }
        if (!password || !confirm) {
            setErrorResponse("Ambos campos de contraseña son obligatorios");
            return;
        }
        if (password !== confirm) {
            setErrorResponse("Las contraseñas no coinciden");
            return;
        }
        if (!PASSWORD_REGEX.test(password)) {
            setErrorResponse("La contraseña debe tener al menos 8 caracteres y debe contener letras y números");
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
                setErrorResponse(mapAuthError(error));
            } else if (error instanceof Error) {
                setErrorResponse(error.message);
            } else {
                setErrorResponse("Error desconocido");
            }
        } finally {
            setLoading(false);

        }

    }

    return (
        <form className="form" onSubmit={handleSubmit} aria-describedby="reset-error">
            <h1>Restablecer contraseña</h1>
            {mensaje && <div role="status" className="infoMessage">{mensaje}</div>}
            {errorResponse && <div id="reset-error" role="alert" className="errorMessage">{errorResponse}</div>}
            {!token && (
                <>
                    <label htmlFor="token">Token</label>
                    <input id="token" name="token" value={token ?? ""} onChange={(evento) => setToken(evento.target.value)} />
                    <small>Introduce el código que te enviamos por correo</small>
                </>
            )}
            <label htmlFor="password">Introduce la nueva contraseña</label>
            <input id="password" name="password" type="password" value={password} onChange={(evento) => setPassword(evento.target.value)} required />
            <label htmlFor="confirm">Confirma la nueva contraseña</label>
            <input id="confirm" name="confirm" type="password" value={confirm} onChange={(evento) => setConfirm(evento.target.value)} required />
            <button type="submit" disabled={loading} aria-busy={loading}>
                {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
        </form>
    );
}