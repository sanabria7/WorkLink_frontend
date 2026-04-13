import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useService } from "../../hooks/useService";
import type { Service } from "../../types/serviceTypes";
import React from "react";

export default function MisServicios() {
  const { getAllServices, service, setService, loading, error } = useService();
  const [services, setServices] = React.useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (err) {
        console.error("Error cargando servicios:", err);
      }
    }
    fetchServices();
  }, [getAllServices]);

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
                <button
                  onClick={() => {
                    console.log("Eliminar servicio", s.id);
                  }}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
