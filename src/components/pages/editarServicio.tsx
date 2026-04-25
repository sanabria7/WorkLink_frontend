import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useService } from "../../hooks/useService";
import Icon from "../misc/icon";
import { isAxiosError } from "axios";
import { mapValidationErrors } from "../../utils/mapValidationErrors";
import { mapGlobalErrors } from "../../utils/mapGlobalErrors";
import type { Categoria, Service } from "../../types/serviceTypes";
import DurationSelect from "../selectDuracion/duracionSelect";

type FormState = {
    titulo: string;
    descripcion: string;
    categoria: Categoria | "";
    precio: string;
    duracion: number | "";
    modalidad: "Presencial" | "Online" | "";
    ubicacion: string;
}

export default function EditarServicio() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { service, getServicioById, updateServicio, loading, saving } = useService();
    const [form, setForm] = useState<FormState>({
        titulo: "",
        descripcion: "",
        categoria: "",
        precio: "",
        duracion: "",
        modalidad: "",
        ubicacion: "",
    });
    const [errorResponse, setErrorResponse] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!id) return;
        getServicioById(id);
    }, [id, getServicioById]);

    useEffect(() => {
        if (service) {
            setForm({
                titulo: service.titulo,
                descripcion: service.descripcion,
                categoria: service.categoria,
                precio: String(service.precio),
                duracion: service.duracion,
                modalidad: service.modalidad,
                ubicacion: service.ubicacion,
            });
        }
    }, [service]);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!id || !service) return;

        const updateData: Service = {
            titulo: form.titulo,
            descripcion: form.descripcion,
            categoria: form.categoria as Categoria,
            precio: Number(form.precio),
            duracion: Number(form.duracion),
            modalidad: form.modalidad as "Presencial" | "Online",
            ubicacion: form.ubicacion,
            proveedorId: service.proveedorId,
        };

        try {
            await updateServicio(id!, updateData);
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
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
            />
            <label htmlFor="descripcion">Descripción</label>
            <textarea
                id="descripcion"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                required
            />
            <label htmlFor="categoria">Categoría</label>
            <select
                id="categoria"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}
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
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                required
            />
            <label htmlFor="duracion">Duración</label>
            <DurationSelect
                value={form.duracion || ""}
                onChange={(e) => setForm({...form, duracion: e})}
            />
            <label>Modalidad</label>
            <div className="radioButtonGroup">
                <input
                    id="modalidad-presencial"
                    type="radio"
                    name="modalidad"
                    value="Presencial"
                    checked={form.modalidad === "Presencial"}
                    onChange={(e) => setForm({ ...form, modalidad: e.target.value as "Presencial" | "Online" })}
                />
                <label htmlFor="modalidad-presencial">Presencial</label>
                <input
                    id="modalidad-online"
                    type="radio"
                    name="modalidad"
                    value="Online"
                    checked={form.modalidad === "Online"}
                    onChange={(e) => setForm({ ...form, modalidad: e.target.value as "Presencial" | "Online" })}
                />
                <label htmlFor="modalidad-online">Online</label>
            </div>
            <label htmlFor="ubicacion">Ubicación</label>
            <input
                id="ubicacion"
                type="text"
                name="ubicacion"
                value={form.ubicacion}
                onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                required
            />
            <button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Actualizar"}
            </button>
            <button type="button" onClick={() => navigate("/mis-servicios")}>Cancelar</button>
        </form>
    );
}
