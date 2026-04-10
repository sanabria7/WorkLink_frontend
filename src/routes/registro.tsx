import { useState } from "react"
import { useAuth } from "../auth/authProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { mapValidationErrors } from "../utils/mapValidationErrors";
import { mapGlobalErrors } from "../utils/mapGlobalErrors";
import Icon from "../components/misc/icon";

export default function Registro() {
    const { registro, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [password, setPassword] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rol, setRol] = useState("");
    const [errorResponse, setErrorResponse] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false)

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        setErrorResponse({});
        setLoading(true);
        try {
            await registro({ nombre, apellido, correo, password, telefono, rol })
            navigate("/login", { replace: true })
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

    if (isAuthenticated) return <Navigate to="/login" replace />

    return (
        <form className="form" onSubmit={handleSubmit} aria-describedby="registro-error">
            <h1>Registro</h1>
            {errorResponse.general &&
                <div id="registro-error" role="alert" className="errorMessage">
                    <Icon name="error"/>
                    {errorResponse.general}
                </div>}
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre"
                name="nombre"
                type="text"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)} required />
            {errorResponse.nombre &&
                <span className="errorMessage">
                    <Icon name="error"/>
                    {errorResponse.nombre}
                </span>}
            <label htmlFor="apellido">Apellido</label>
            <input id="apellido"
                name="apellido"
                type="text"
                value={apellido}
                onChange={(evento) => setApellido(evento.target.value)} required />
            {errorResponse.apellido &&
                <span className="errorMessage">
                    <Icon name="error"/>
                    {errorResponse.apellido}
                </span>}
            <label htmlFor="correo">Correo</label>
            <input id="correo"
                name="correo"
                type="email"
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)} required />
            {errorResponse.correo &&
                <span className="errorMessage">
                    <Icon name="error"/>
                    {errorResponse.correo}
                </span>}
            <label htmlFor="password">Contraseña</label>
            <input id="password"
                name="password"
                type="password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)} required />
            {errorResponse.password &&
                <span className="errorMessage">
                    <Icon name="error"/>
                    {errorResponse.password}
                </span>}
            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono"
                name="telefono"
                type="tel"
                value={telefono}
                inputMode="tel"
                onChange={(evento) => setTelefono(evento.target.value)} required />
            {errorResponse.telefono &&
                <span className="errorMessage">
                    <Icon name="error"/>
                    {errorResponse.telefono}
                </span>}
            <label htmlFor="rol">Elige tu rol</label>
            <select id="rol" name="rol" value={rol} onChange={(evento) => setRol(evento.target.value)} required>
                <option value="" disabled hidden>-- Selecciona un rol --</option>
                <option value="cliente">Cliente</option>
                <option value="proveedor">Proveedor</option>
            </select>
            {errorResponse.rol &&
                <span className="errorMessage">
                    <Icon name="error"/>
                    {errorResponse.rol}
                </span>}
            <button type="submit" disabled={loading} aria-busy={loading}>{loading ? "Verificando datos..." : "Regístrate"}</button>
            <p> ¿Ya tienes cuenta?
                <Link to="/login">Inicia sesión</Link>
            </p>
        </form>
    )
}
