import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authService";
import { isAxiosError } from "axios";
import { mapAuthError } from "../utils/mapAuthError";

export default function ForgotPassword() {
    const [correo, setCorreo] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [errorResponse, setErrorResponse] = useState<string | null>(null);

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        setErrorResponse(null);
        setMensaje(null);

        if (!correo) {
            setErrorResponse("El campo del correo es obligatorio");
            return;
        }
        setLoading(true);
        try {
            console.log("hola aqui")
            const response = await forgotPassword(correo);
            setMensaje(response);
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
        <form className="form" onSubmit={handleSubmit} aria-describedby="forgot-error">
            <h1>Recuperar Contraseña</h1>
            {mensaje && <div role="status" className="infoMessage">{mensaje}</div>}
            {errorResponse && <div id="forgot-error" role="alert" className="errorMessage">{errorResponse}</div>}
            <label htmlFor="correo">Correo</label>
            <input id="correo" name="correo" type="email" value={correo} onChange={(evento) => setCorreo(evento.target.value)} required />
            <button type="submit" disabled={loading} aria-busy={loading}>{loading ? "Enviando mail..." : "Enviar enlace de recuperación"}</button>
            <button type="button" className="btn-tertiary">
                <Link to="/login">Cancelar</Link>
            </button>
        </form>
    );
}