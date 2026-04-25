import { Link, useParams } from "react-router-dom";
import Icon from "../../components/misc/icon";
import { useEffect, useState } from "react";
import type { profilesService } from "../../types/serviceTypes";
import { getServicioById } from "../../api/offerService";
import { getByIdPerfilProveedor } from "../../api/profilesService";
import ReservaModal from "../../components/modals/reservaModal";

export default function Servicio() {
    const { id } = useParams<{ id: string }>();
    const [servicio, setServicio] = useState<profilesService | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
        getServicioById(id).then(async (servicio) => {
            const perfilProveedor = await getByIdPerfilProveedor(servicio.proveedorId);
            const servicioCompleto: profilesService = { ...servicio, proveedor: perfilProveedor };
            setServicio(servicioCompleto);
        })
            .catch(() => (console.log("No se pudo cargar el servicio")));
    }, [id])

    if (!servicio) return <p>Cargando servicio...</p>

    return (
        <div style={{ backgroundColor: "", display: "flex", justifyContent: "center", marginTop: "1rem", marginInline: "15%" }}>
            {/* Columna perfil-reserva */}
            <section style={{ backgroundColor: "", display: "flex", marginLeft: "2rem", flexDirection: "column", maxWidth: "30rem", minWidth: "30rem", gap: "2rem" }}>
                {/* Perfil del proveedor */}
                <div style={{ backgroundColor: "", padding: "2rem", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid #eaeaea", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)" }}>
                    <div style={{ borderRadius: "1rem", height: "150px", overflow: "hidden" }}>
                        <img
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            src={"https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzYxNjQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                        />
                    </div>
                    {/* Avatar + Name */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ display: "flex", width: "fit", padding: "0", border: "solid", borderColor: "lightgrey", borderRadius: "999px", overflow: "hidden" }}>
                            <img
                                style={{ width: "6rem", height: "6rem" }}
                                src={"https://images.unsplash.com/photo-1564783538911-cd6bb5d6bed2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGxhdGlubyUyMG1hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzM3MjcwNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                            />
                        </div>
                        <h3 style={{ display: "flex", marginTop: "10px", marginBottom: "0px", justifyContent: "center" }}>
                            <Link to={`/${servicio.proveedor.usuario.email}`} style={{ textDecoration: "none", color: "inherit" }}>{`${servicio.proveedor.usuario.nombre} ${servicio.proveedor.usuario.apellido}`}</Link>
                        </h3>
                    </div>
                    {/* Bio + Detalles */}
                    <p style={{ textAlign: "center", marginBlockStart: "auto" }}>
                        {servicio.proveedor.biografia}
                    </p>
                    <div style={{ display: "grid", gridAutoFlow: "column", padding: "10px", borderTop: "1px solid #eaeaea", borderBottom: "1px solid #eaeaea" }}>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "3px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                <Icon name="star_filled" />
                                <span>{servicio.proveedor.ratingPromedio}</span>
                            </div>
                            <span style={{ fontWeight: "400", color: "grey" }}>
                                Rating
                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "3px", borderInline: "1px solid #eaeaea" }}>
                            <div>196</div>
                            <span style={{ fontWeight: "400", color: "grey" }}>Reseñas</span>
                        </div>
                        <div style={{ display: "flex", color: "gray", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "3px" }}>
                            <div style={{ display: "flex" }}>
                                <Icon name="location" />
                            </div>
                            <div>{servicio.ubicacion}</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Icon name="share" />
                            <span>Compartir</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Icon name="favorite" />
                            <span>Añadir a Favoritos</span>
                        </div>
                    </div>
                </div>
                {/* Reserva */}
                <div style={{ backgroundColor: "", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", border: "1px solid #eaeaea", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontWeight: "bold" }}>${servicio.precio} COP</span>
                        <small>por participante</small>
                    </div>
                    <button onClick={() => setModalOpen(true)}
                        style={{ height: "44px", width: "fit-content", border: "none", borderRadius: "6px", backgroundColor: "#0077ff", color: "white", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}>
                        Mostrar Fechas
                    </button>
                </div>
            </section>
            {/* Columna Detalles del servicio */}
            <section style={{ backgroundColor: "", width: "80%", display: "flex", marginInline: "4rem", flexDirection: "column", maxWidth: "60rem", gap: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", width: "100%", backgroundColor: "" }}>
                    <h4 style={{ backgroundColor: "", marginTop: "0px", marginBottom: "8px", color: "#0077ff", fontSize: "1rem" }}>
                        {servicio.categoria}
                    </h4>
                    <div style={{ display: "flex" }}>
                        <h1 style={{ backgroundColor: "", width: "100%", marginTop: "1rem", marginBottom: "1rem" }}>
                            {servicio.titulo}
                        </h1>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "baseline", gap: "2rem", fontSize: "0.9rem" }}>
                        <h4 style={{ margin: "0px", fontWeight: "400", color: "grey" }}>
                            {servicio.modalidad}
                        </h4>
                        <h4 style={{ margin: "0px", fontWeight: "400", color: "grey" }}>
                            {servicio.duracion} min
                        </h4>
                    </div>
                    <div style={{ width: "inherit", borderBottom: "1px solid #eaeaea" }}>
                        <p style={{ overflowWrap: "anywhere" }}>
                            {servicio.descripcion}
                        </p>
                    </div>
                    {/* Reseñas */}
                    <div style={{ backgroundColor: "", display: "flex", flexDirection: "column" }}>
                        <h2 style={{ marginTop: "8px" }}>Reseñas</h2>
                        <div style={{}}>

                        </div>
                    </div>
                </div>
            </section>
            <ReservaModal open={modalOpen} onClose={()=>setModalOpen(false)} servicio={servicio}  />
        </div>
    );
}