import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { isAxiosError } from "axios";
import * as authService from "../api/authService";
import { mapGlobalErrors } from "../utils/mapGlobalErrors";
import Icon from "../components/misc/icon";

// Lo que manda registro.tsx por navigate(..., { state })
interface EstadoRegistro {
    correo?: string;
    correoEnviado?: boolean;
}

// Pantalla de espera tras el registro: indica a qué correo se envió el enlace de
// verificación y permite reenviarlo (p.ej. si el SMTP falló o no llegó).
export default function VerificaCorreo() {
    const location = useLocation();
    const estado = (location.state ?? {}) as EstadoRegistro;
    const correo = estado.correo ?? "";

    // Si el backend no pudo enviarlo, lo avisamos de entrada
    const [correoEnviado, setCorreoEnviado] = useState<boolean>(estado.correoEnviado !== false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reenviando, setReenviando] = useState(false);

    // Sin correo en el estado (entraron directo a la URL) no hay nada que mostrar
    if (!correo) {
        return <Navigate to="/registro" replace />;
    }

    async function reenviar(): Promise<void> {
        setMensaje(null);
        setError(null);
        setReenviando(true);
        try {
            const respuesta = await authService.reenviarVerificacion(correo);
            setCorreoEnviado(respuesta.correoEnviado);
            if (respuesta.correoEnviado) {
                setMensaje("Listo, te reenviamos el correo. Revisa tu bandeja de entrada.");
            } else {
                setError("No pudimos enviar el correo. Inténtalo de nuevo en un momento.");
            }
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError(mapGlobalErrors(err));
            } else {
                setError("Error desconocido");
            }
        } finally {
            setReenviando(false);
        }
    }

    return (
        <section className="form" aria-labelledby="verifica-titulo">
            <h1 id="verifica-titulo">Revisa tu correo</h1>

            <p>
                Enviamos un enlace de verificación a <strong>{correo}</strong>.
                Ábrelo para activar tu cuenta. El enlace vence en 24 horas.
            </p>
            <p><small>Si no lo ves, revisa la carpeta de spam o correo no deseado.</small></p>

            {!correoEnviado && !error && (
                <div role="alert" className="errorMessage">
                    <Icon name="error" />
                    No pudimos enviar el correo. Pulsa "Reenviar correo" para intentarlo de nuevo.
                </div>
            )}
            {mensaje && <div role="status" className="infoMessage">{mensaje}</div>}
            {error && (
                <div role="alert" className="errorMessage">
                    <Icon name="error" />
                    {error}
                </div>
            )}

            <button type="button" onClick={reenviar} disabled={reenviando} aria-busy={reenviando}>
                {reenviando ? "Reenviando..." : "Reenviar correo"}
            </button>

            <p>
                ¿Ya verificaste tu cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
        </section>
    );
}
