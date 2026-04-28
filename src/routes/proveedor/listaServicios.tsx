import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useService } from "../../hooks/useService";
import type { Service } from "../../types/serviceTypes";
import { useAuth } from "../../auth/authProvider";

export default function MisServicios() {
  const { perfilProveedor } = useAuth();
  const { getProveedorByIdServices, eliminarServicio, loading, error } = useService();
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function ServicesByProveedorId() {
      if (!perfilProveedor?.id) return;
      try {
        const data = await getProveedorByIdServices(perfilProveedor?.id);
        setServices(data);
      } catch (err) {
        console.error("Error cargando servicios:", err);
      }
    }
    ServicesByProveedorId();
  }, [perfilProveedor?.id]);

  const handleEliminarServicio = async (id: string) => {
    try {
      const servicioEliminado = services.find((s) => s.id === id);
      await eliminarServicio(id);
      setServices((prev) => prev.filter((services) => services.id !== id));
      alert(`El servicio ${servicioEliminado?.id} - ${servicioEliminado?.titulo} se ha eliminado correctamente`)
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
  }

  if (loading) return <p>Cargando servicios...</p>;
  if (error) return <p>Error: {String(error)}</p>;

  return (
    <div className="mis-servicios">
      <h1>Mis Servicios</h1>
      <button onClick={() => navigate("/crear-servicio")}>
        <span>Crear Servicio</span>
      </button>
      <table className="servicios-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoría</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{s.titulo}</td>
              <td>{s.categoria}</td>
              <td>{s.ubicacion}</td>
              <td>
                <button onClick={() => navigate(`/editar-servicio/${s.id}`)}>
                  Editar
                </button>
                <button onClick={() => handleEliminarServicio(s.id!)} style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
