import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import * as authService from "../api/authService";
import { mapGlobalErrors } from "../utils/mapGlobalErrors";
import Icon from "../components/misc/icon";

type Estado = "verificando" | "ok" | "error";

// El backend responde { error: "..." } en los 400; mapGlobalErrors solo lee "message".
function mensajeDeError(err: unknown): string {
    if (isAxiosError(err)) {
        const data = err.response?.data as { error?: string } | undefined;
        if (data && data.error) {
            return data.error;
        }
        return mapGlobalErrors(err);
    }
    return "No se pudo verificar la cuenta.";
}

// Destino del enlace del correo: /verificar?token=...  Llama al backend una sola
// vez y muestra el resultado.
export default function Verificar() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [estado, setEstado] = useState<Estado>("verificando");
    const [mensaje, setMensaje] = useState<string>("");

    // Guarda: el token se marca como USADO al verificar, así que una segunda
    // llamada (p.ej. StrictMode) devolvería "inválido" aunque ya funcionó.
    const yaLlamado = useRef(false);

    useEffect(function verificarAlCargar() {
        if (yaLlamado.current) {
            return;
        }
        yaLlamado.current = true;

        if (!token) {
            setEstado("error");
            setMensaje("El enlace no trae el token de verificación.");
            return;
        }

        async function verificar(): Promise<void> {
            try {
                const respuesta = await authService.verificarCuenta(token);
                setEstado("ok");
                setMensaje(respuesta.mensaje);
            } catch (err: unknown) {
                setEstado("error");
                setMensaje(mensajeDeError(err));
            }
        }
        verificar();
    }, [token]);

    return (
        <section className="form" aria-live="polite">
            <h1>Verificación de cuenta</h1>

            {estado === "verificando" && <p>Verificando tu cuenta...</p>}

            {estado === "ok" && (
                <>
                    <div role="status" className="infoMessage">{mensaje}</div>
                    <p><Link to="/login">Iniciar sesión</Link></p>
                </>
            )}

            {estado === "error" && (
                <>
                    <div role="alert" className="errorMessage">
                        <Icon name="error" />
                        {mensaje}
                    </div>
                    <p>
                        El enlace pudo haber vencido o ya fue usado.{" "}
                        <Link to="/login">Intenta iniciar sesión</Link> o{" "}
                        <Link to="/registro">regístrate de nuevo</Link>.
                    </p>
                </>
            )}
        </section>
    );
}
