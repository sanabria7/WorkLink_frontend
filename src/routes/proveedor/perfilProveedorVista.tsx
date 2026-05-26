import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as profilesService from "../../api/profilesService";
import type { ProfileProveedor } from "../../types/userTypes";
import Icon from "../../components/misc/icon";

export default function ProveedorPublicView() {
    const { correo } = useParams<{ correo: string }>();
    console.log("Valor de useParams().correo:", correo);
    const [proveedor, setProveedor] = useState<ProfileProveedor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProveedor = async () => {
            if (!correo) {
                setError("No se proporcionó un correo válido en la URL");
                setLoading(false);
                return;
            }
            try {
                const data = await profilesService.getPerfilProveedor(correo!);
                setProveedor(data);
            } catch (err) {
                setError("No se pudo cargar el proveedor");
            } finally {
                setLoading(false);
            }
        };
        fetchProveedor();
    }, [correo]);

    if (loading) return <p>Cargando proveedor...</p>;
    if (error) return <p>{error}</p>;
    if (!proveedor) return <p>No se encontró el proveedor</p>;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "3rem" }}>
                {/* Sidebar - Perfil */}
                <div style={{ position: "sticky", top: "2rem", alignSelf: "start" }}>
                    <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "2rem", textAlign: "center", border: "4px solid white", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                        <div style={{ width: "160px", height: "160px", borderRadius: "999px", margin: "0 auto 1.5rem", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                            <img 
                                src={proveedor.usuario.fotoPerfilUrl || "https://via.placeholder.com/160"} 
                                alt={proveedor.usuario.nombre}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 0.25rem" }}>
                            {proveedor.usuario.nombre} {proveedor.usuario.apellido}
                        </h1>
                        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>Proveedor en WorkLink</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginBottom: "2rem" }}>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>{proveedor.ratingPromedio.toFixed(1)}</p>
                                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Calificación</p>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>12</p>
                                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Reseñas</p>
                            </div>
                        </div>
                        {proveedor.verificado && (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#15803d", fontWeight: 600, marginBottom: "1.5rem" }}>
                                <Icon name="verified" /> Identidad verificada
                            </div>
                        )}
                    </div>
                </div>
                {/* Contenido Principal */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                    {/* Biografía */}
                    <div>
                        <h2 style={{ fontSize: "1.65rem", fontWeight: 700, marginBottom: "1rem" }}>Acerca de {proveedor.usuario.nombre}</h2>
                        <p style={{ lineHeight: "1.65", fontSize: "1.05rem", color: "#374151" }}>
                            {proveedor.biografia || "Este proveedor aún no ha agregado una biografía."}
                        </p>
                    </div>
                    {/* Información adicional */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
                        <div style={{ backgroundColor: "#f9fafb", padding: "1.5rem", borderRadius: "20px" }}>
                            <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>📍 Ubicación</p>
                            <p style={{ fontWeight: 600 }}>Bugayork, Colombia</p>
                        </div>
                        <div style={{ backgroundColor: "#f9fafb", padding: "1.5rem", borderRadius: "20px" }}>
                            <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>⏰ Disponibilidad</p>
                            <p style={{ fontWeight: 600 }}>{proveedor.horarioDisponibilidad || "No especificado"}</p>
                        </div>
                    </div>
                    {/* Reseñas */}
                    <div>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Reseñas de {proveedor.usuario.nombre}</h3>                        
                    </div>
                </div>
            </div>
        </div>
    );
}
