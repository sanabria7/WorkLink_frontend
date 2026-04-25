import { useEffect, useState } from "react";
import Icon from "../misc/icon";
import { useAuth } from "../../auth/authProvider";
import { hasHorarios } from "../../api/horariosService";
import { useNavigate } from "react-router-dom";
import { useService } from "../../hooks/useService";
import type { Categoria, Service } from "../../types/serviceTypes";
import { isAxiosError } from "axios";
import { mapValidationErrors } from "../../utils/mapValidationErrors";
import { mapGlobalErrors } from "../../utils/mapGlobalErrors";
import DurationSelect from "../selectDuracion/duracionSelect";

export default function CrearServicio() {
    const { perfilProveedor } = useAuth();
    const { crearServicio, saving } = useService();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState<Categoria | null>(null);
    const [precio, setPrecio] = useState("");
    const [duracion, setDuracion] = useState<number | "">("");
    const [modalidad, setModalidad] = useState<"Presencial" | "Online" | null>(null);
    const [ubicacion, setUbicacion] = useState("");
    const [errorResponse, setErrorResponse] = useState<Record<string, string>>({});

    const [tieneHorarios, setTieneHorarios] = useState<boolean | null>(null);
    const [verificarHorarios, setVerificarHorarios] = useState(true);

    const proveedorId = perfilProveedor?.id;

    useEffect(() => {
        if (!proveedorId) {
            setVerificarHorarios(false);
            return;
        }

        const verificar = async () => {
            try {
                console.log("Verificando horarios para proveedor ID:", proveedorId);
                const resultados = await hasHorarios(proveedorId);
                setTieneHorarios(resultados);
                console.log("Resultados Horarios:", resultados);
            } catch (error) {
                console.error("Error al verificar horarios:", error);
                setTieneHorarios(false);
            } finally {
                setVerificarHorarios(false);
            }
        };
        verificar();
    }, [proveedorId]);

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        console.log(perfilProveedor);
        if (!proveedorId) {
            console.log("No se encontró ID del proveedor");
            return;
        }
        if (!categoria || !modalidad) {
            setErrorResponse({
                general: "Completa los campos vacíos"
            });
            return;
        }

        if (duracion === "") {
            setErrorResponse({
                general: "Debes seleccionar una duración"
            });
            return;
        }

        const servicio: Service = {
            titulo,
            descripcion,
            categoria,
            precio: Number(precio),
            duracion,
            modalidad,
            ubicacion,
            proveedorId,
        }
        try {
            await crearServicio(servicio);
            alert("Servicio creado correctamente")
            navigate("/mis-servicios", { replace: true });
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
        }
    }

    if (verificarHorarios) return <p>Verificando disponibilidad de horarios...</p>

    if (tieneHorarios === false) {
        return (
            <div style={{ maxWidth: "42rem", margin: "3rem auto 0", padding: "2.5rem", backgroundColor: "white", borderRadius: "1.5rem", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", textAlign: "center" }}>
                <Icon name="calendar" />
                <h1 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "0.75rem" }}>
                    Configura tus horarios primero
                </h1>
                <p style={{ fontSize: "1.125rem", color: "#4B5563", marginBottom: "2rem" }}>
                    Para poder publicar servicios, necesitas definir tus días y horarios de atención.
                </p>
                <button
                    onClick={() => navigate("/configurar-horarios")}
                    style={{ backgroundColor: "#2563EB", color: "white", padding: "1rem 2.5rem", borderRadius: "1rem", fontSize: "1.125rem", fontWeight: "600", border: "none", cursor: "pointer", transition: "background-color 0.2s" }}>
                    Ir a configurar mis horarios
                </button>
            </div>
        );
    }

    return (
        <form className="form" onSubmit={handleSubmit} aria-describedby="Servicio-error">
            <div>
                <button className="btn-quaternary" type="button" onClick={() => navigate(-1)}>Atrás</button>
                <h1>Crear Servicio</h1>
            </div>
            {errorResponse.general &&
                <div id="Servicio-error" role="alert" className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.general}
                </div>}
            <label htmlFor="titulo">Título</label>
            <input id="titulo"
                name="titulo"
                type="text"
                value={titulo}
                onChange={(evento) => setTitulo(evento.target.value)} required />
            {errorResponse.titulo &&
                <span className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.titulo}
                </span>}
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion"
                name="descripcion"
                value={descripcion}
                onChange={(evento) => setDescripcion(evento.target.value)} required />
            {errorResponse.descripcion &&
                <span className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.descripcion}
                </span>}
            <label htmlFor="categoria">Categoria</label>
            <select id="categoria" name="categoria" value={categoria ?? ""} onChange={(evento) => setCategoria(evento.target.value as Categoria)} required>
                <option value="" disabled hidden>-- Elige una categoria --</option>
                <option value="Arte">Arte</option>
                <option value="Educacion">Educación</option>
                <option value="Eventos">Eventos</option>
            </select>
            {errorResponse.categoria &&
                <span className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.categoria}
                </span>}
            <label htmlFor="precio">Precio</label>
            <input id="precio"
                name="precio"
                type="number"
                value={precio}
                inputMode="numeric"
                onChange={(evento) => setPrecio(evento.target.value)} required />
            {errorResponse.precio &&
                <span className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.precio}
                </span>}
            <label htmlFor="duracion">Duración</label>
            <DurationSelect
                value={duracion}
                onChange={(evento) => setDuracion(evento)}
            />
            {errorResponse.duracion &&
                <span className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.duracion}
                </span>}
            <label htmlFor="modalidad-presencial">Modalidad</label>
            <div className="radioButtonGroup">
                <input id="modalidad-presencial"
                    type="radio"
                    name="modalidad"
                    value="Presencial"
                    checked={modalidad === "Presencial"}
                    onChange={(evento) => setModalidad(evento.target.value as "Presencial" | "Online")} required />
                <label htmlFor="modalidad-presencial">Presencial</label>
                <input id="modalidad-online"
                    type="radio"
                    name="modalidad"
                    value="Online"
                    checked={modalidad === "Online"}
                    onChange={(evento) => setModalidad(evento.target.value as "Presencial" | "Online")} required />
                <label htmlFor="modalidad-online">Online</label>
                {errorResponse.modalidad &&
                    <span className="errorMessage">
                        <Icon name="error" />
                        {errorResponse.modalidad}
                    </span>}
            </div>
            <label htmlFor="ubicacion">Ubicación</label>
            <input id="ubicacion"
                type="text"
                name="ubicacion"
                value={ubicacion}
                onChange={(evento) => setUbicacion(evento.target.value)} required />
            {errorResponse.ubicacion &&
                <span className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.ubicacion}
                </span>}
            <button type="submit" disabled={saving} aria-busy={saving}>{saving ? "Creando servicio..." : "Publicar"}</button>
            <button type="reset" onClick={() => navigate("/dashboard")}>Cancelar</button>
        </form>
    );
}