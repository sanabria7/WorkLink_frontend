import { useState } from "react";
import Icon from "../misc/icon";
import { useAuth } from "../../auth/authProvider";
import { useNavigate } from "react-router-dom";
import { useService } from "../../hooks/useService";
import type { Categoria, Service } from "../../types/serviceTypes";
import { isAxiosError } from "axios";
import { mapValidationErrors } from "../../utils/mapValidationErrors";
import { mapGlobalErrors } from "../../utils/mapGlobalErrors";

export default function CrearServicio() {
    const { perfilProveedor } = useAuth();
    const { crearServicio, saving } = useService();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState<Categoria | "">("");
    const [precio, setPrecio] = useState(0);
    const [duracion, setDuracion] = useState(0);
    const [modalidad, setModalidad] = useState<"Presencial" | "Online" | "">("");
    const [ubicacion, setUbicacion] = useState("");
    const [errorResponse, setErrorResponse] = useState<Record<string, string>>({});

    async function handleSubmit(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        console.log(perfilProveedor);
        if (!perfilProveedor?.id) {
            console.log("No se encontró ID del proveedor");
            return;
        }
        const servicio: Service = {
            titulo,
            descripcion,
            categoria: categoria as Categoria,
            precio,
            duracion,
            modalidad: modalidad as "Presencial" | "Online",
            ubicacion,
            proveedorId: perfilProveedor.id,
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
            <select id="categoria" name="categoria" value={categoria} onChange={(evento) => setCategoria(evento.target.value as Categoria)} required>
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
                onChange={(evento) => setPrecio(Number(evento.target.value))} required />
            {errorResponse.precio &&
                <span className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.precio}
                </span>}
            <label htmlFor="duracion">Duración</label>
            <input id="duracion"
                name="duracion"
                type="number"
                min="30"
                value={duracion}
                inputMode="numeric"
                onChange={(evento) => setDuracion(Number(evento.target.value))}
                placeholder="Mínimo 30 minutos"
                required />
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
                <label htmlFor="modalidad-online">Presencial</label>
                <input id="modalidad-online"
                    type="radio"
                    name="modalidad"
                    value="Online"
                    checked={modalidad === "Online"}
                    onChange={(evento) => setModalidad(evento.target.value as "Presencial" | "Online")} required />
                <label htmlFor="modalidad">Online</label>
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
            <button type="submit" disabled={saving} aria-busy={saving} onClick={() => console.log("clic")}>{saving ? "Creando servicio..." : "Publicar"}</button>
            <button type="reset" onClick={() => navigate("/dashboard")}>Cancelar</button>
        </form>
    );
}