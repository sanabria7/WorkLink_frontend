import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider";
import { isAxiosError } from "axios";
import { mapAuthError } from "../utils/mapAuthError";

export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const from = (location.state as any)?.from as string | undefined;

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();

        if (!correo || !password) {
            setErrorResponse("Algunos campos están incompletos, revisa nuevamente");
            return;
        }
        setLoading(true)
        try {
            await login(correo, password);
            navigate(from ?? "/index", { replace: true });
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setErrorResponse(mapAuthError(err));
            } else if (err instanceof Error) {
                setErrorResponse(err.message);
            } else {
                setErrorResponse("Error desconocido");
            }
        } finally {
            setLoading(false)
        }
    }

    if (isAuthenticated) return <Navigate to="/index" replace />
    
    return (
        <form className="form" onSubmit={handleSubmit} aria-describedby="login-error">
            <h1>Login</h1>
            {errorResponse && <div id="login-error" role="alert" className="errorMessage">{errorResponse}</div>}
            <label htmlFor="email">Correo</label>
            <input id="email"
                name="email"
                type="email"
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)} required/>
            <label htmlFor="password">Contraseña</label>
            <input id="password"
                name="password"
                type="password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)} required/>
            <p> ¿Olvidaste la contraseña?
                <Link to="/forgot-password"> Haz clic aquí para restaurarla</Link>
            </p>
            <button type="submit" disabled={loading} aria-busy={loading}>{loading ? "Autenticando..." : "Ingresar"}</button>
            <p> ¿No tienes cuenta?
                <Link to="/registro"> Regístrate </Link>
            </p>
        </form>
    );
}