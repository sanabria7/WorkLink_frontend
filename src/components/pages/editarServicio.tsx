import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useService } from "../../hooks/useService";
import Icon from "../misc/icon";
import { isAxiosError } from "axios";
import { mapValidationErrors } from "../../utils/mapValidationErrors";
import { mapGlobalErrors } from "../../utils/mapGlobalErrors";
import type { Categoria } from "../../types/serviceTypes";

export default function EditarServicio() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { service, setService, getServicioById, updateServicio, loading, saving } = useService();
    const [errorResponse, setErrorResponse] = useState<Record<string, string>>({});

    useEffect(() => {
        if (id) {
            getServicioById(id);
        }
    }, [id, getServicioById]);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!service) return;

        try {
            await updateServicio(id!, service);
            alert("Servicio actualizado correctamente");
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

    if (loading) return <p>Cargando servicio...</p>;
    if (!service) return <p>No se encontró el servicio</p>;

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h1>Editar Servicio</h1>
            {errorResponse.general &&
                <div id="Servicio-error" role="alert" className="errorMessage">
                    <Icon name="error" />
                    {errorResponse.general}
                </div>}
            <label htmlFor="titulo">Título</label>
            <input
                id="titulo"
                type="text"
                value={service.titulo}
                onChange={(e) => setService({ ...service, titulo: e.target.value })}
                required
            />
            <label htmlFor="descripcion">Descripción</label>
            <textarea
                id="descripcion"
                value={service.descripcion}
                onChange={(e) => setService({ ...service, descripcion: e.target.value })}
                required
            />
            <label htmlFor="categoria">Categoría</label>
            <select
                id="categoria"
                value={service.categoria}
                onChange={(e) => setService({ ...service, categoria: e.target.value as Categoria})}
                required
            >
                <option value="" disabled hidden>-- Elige una categoría --</option>
                <option value="Arte">Arte</option>
                <option value="Educacion">Educación</option>
                <option value="Eventos">Eventos</option>
            </select>
            <label htmlFor="precio">Precio</label>
            <input
                id="precio"
                type="number"
                value={service.precio}
                onChange={(e) => setService({ ...service, precio: Number(e.target.value) })}
                required
            />
            <label htmlFor="duracion">Duración</label>
            <input
                id="duracion"
                type="number"
                min="30"
                value={service.duracion}
                onChange={(e) => setService({ ...service, duracion: Number(e.target.value) })}
                placeholder="Mínimo 30 minutos"
                required
            />
            <label>Modalidad</label>
            <div className="radioButtonGroup">
                <input
                    id="modalidad-presencial"
                    type="radio"
                    name="modalidad"
                    value="Presencial"
                    checked={service.modalidad === "Presencial"}
                    onChange={(e) => setService({ ...service, modalidad: e.target.value as "Presencial" | "Online" })}
                />
                <label htmlFor="modalidad-presencial">Presencial</label>
                <input
                    id="modalidad-online"
                    type="radio"
                    name="modalidad"
                    value="Online"
                    checked={service.modalidad === "Online"}
                    onChange={(e) => setService({ ...service, modalidad: e.target.value as "Presencial" | "Online"})}
                />
                <label htmlFor="modalidad-online">Online</label>
            </div>
            <label htmlFor="ubicacion">Ubicación</label>
            <input
                id="ubicacion"
                type="text"
                name="ubicacion"
                value={service.ubicacion}
                onChange={(e) => setService({ ...service, ubicacion: e.target.value })}
                required
            />
            <button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Actualizar"}
            </button>
            <button type="button" onClick={() => navigate("/mis-servicios")}>Cancelar</button>
        </form>
    );
}
