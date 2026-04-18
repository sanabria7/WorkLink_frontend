import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as profilesService from "../../api/profilesService";
import type { ProfileProveedor } from "../../types/userTypes";

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
        <div className="perfil-prov">
            <h1>Perfil público del proveedor</h1>
            <p><strong>Nombre:</strong> {proveedor.usuario.nombre}</p>
            <p><strong>Apellido:</strong> {proveedor.usuario.apellido}</p>
            <p><strong>Correo:</strong> {proveedor.usuario.email}</p>
            {proveedor.usuario.fotoPerfilUrl && (
                <img
                    src={proveedor.usuario.fotoPerfilUrl}
                    alt="Foto del proveedor"
                    style={{ width: "150px", borderRadius: "50%" }}
                />
            )}
            <p><strong>Biografía:</strong> {proveedor.biografia}</p>
            <p><strong>Horario de disponibilidad:</strong> {proveedor.horarioDisponibilidad}</p>
            <p><strong>Verificado:</strong> {proveedor.verificado ? "Sí" : "No"}</p>
            <p><strong>Rating promedio:</strong> {proveedor.ratingPromedio}</p>
        </div>
    );
}
