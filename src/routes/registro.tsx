import { useState } from "react"
import { useAuth } from "../auth/authProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { mapAuthError } from "../utils/mapAuthError";

export default function Registro() {
    const { registro, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [password, setPassword] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rol, setRol] = useState("cliente");
    const [errorResponse, setErrorResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        setErrorResponse(null);

        if (!nombre || !apellido || !correo || !password || !telefono || !rol) {
            setErrorResponse("Algunos campos están incompletos, revisa nuevamente");
            return;
        }
        setLoading(true)
        try {
            await registro({ nombre, apellido, correo, password, telefono, rol })
            navigate("/login", { replace: true })
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

    if (isAuthenticated) return <Navigate to="/login" replace />

    return (
        <form className="form" onSubmit={handleSubmit} aria-describedby="registro-error">
            <h1>Registro</h1>
            {errorResponse && <div id="registro-error" role="alert" className="errorMessage">{errorResponse}</div>}
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre"
                name="nombre"
                type="text"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)} required />
            <label htmlFor="apellido">Apellido</label>
            <input id="apellido"
                name="apellido"
                type="text"
                value={apellido}
                onChange={(evento) => setApellido(evento.target.value)} required />
            <label htmlFor="correo">Correo</label>
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
            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono"
                name="telefono"
                type="tel"
                value={telefono}
                inputMode="tel"
                onChange={(evento) => setTelefono(evento.target.value)} required />
            <label htmlFor="rol">Elige tu rol</label>
            <select id="rol" name="rol" value={rol} onChange={(evento) => setRol(evento.target.value)} required>
                <option value="">-- Selecciona un rol --</option>
                <option value="cliente">Cliente</option>
                <option value="proveedor">Proveedor</option>
            </select>
            <button type="submit" disabled={loading} aria-busy={loading}>{loading ? "Verificando datos..." : "Regístrate"}</button>
            <p> ¿Ya tienes cuenta?
                <Link to="/login"> Inicia sesión</Link>
            </p>
        </form>
    )
}