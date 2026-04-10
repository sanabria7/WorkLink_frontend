import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider";
import { isAxiosError } from "axios";
import { mapGlobalErrors } from "../utils/mapGlobalErrors";
import Icon from "../components/misc/icon";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        setLoading(true)
        try {
            const loggedUser = await login(correo, password);
            if (loggedUser?.rol === "cliente") {
                navigate("/", { replace: true });
            } else if (loggedUser?.rol === "proveedor") {
                navigate("/dashboard", { replace: true });
            }
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setErrorResponse(mapGlobalErrors(err));
            } else if (err instanceof Error) {
                setErrorResponse(err.message);
            } else {
                setErrorResponse("Error desconocido");
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit} aria-describedby="login-error">
            <h1>Login</h1>
            {errorResponse && 
            <div id="login-error" role="alert" className="errorMessage">
                <Icon name="error"/>
                {errorResponse}
            </div>}
            <label htmlFor="email">Correo</label>
            <input id="email"
                name="email"
                type="email"
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)} required />
            <label htmlFor="password">Contraseña</label>
            <input id="password"
                name="password"
                type="password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)} required />
            <p> ¿Olvidaste la contraseña?
                <Link to="/forgot-password">Recuperar contraseña</Link>
            </p>
            <button type="submit" disabled={loading} aria-busy={loading}>{loading ? "Autenticando..." : "Ingresar"}</button>
            <p> ¿No tienes cuenta?
                <Link to="/registro">Regístrate </Link>
            </p>
        </form>
    );
}