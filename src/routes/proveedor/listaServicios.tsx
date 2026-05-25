import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useService } from "../../hooks/useService";
import { useAuth } from "../../auth/authProvider";
import { getProveedorReservaById } from "../../api/reservasService";
import ServicioRow from "../../components/tablaServicios/serviciosRow";
import EliminarServicioModal from "../../components/modals/eliminarServicioModal";
import type { Service } from "../../types/serviceTypes";
import type { ReservaDTO } from "../../types/reservaTypes";
import Icon from "../../components/misc/icon";

export default function MisServicios() {
  const { perfilProveedor } = useAuth();
  const navigate = useNavigate();
  const { getProveedorByIdServices, eliminarServicio, loading, error } = useService();
  const [services, setServices] = useState<Service[]>([]);
  const [reservas, setReservas] = useState<ReservaDTO[]>([]);
  const [servicioEliminar, setServicioEliminar] = useState<Service | null>(null);

  useEffect(() => {
    async function cargarServicios() {
      if (!perfilProveedor?.id) return;
      try {
        const data = await getProveedorByIdServices(perfilProveedor.id);
        setServices(data);

      } catch (err) {
        console.error("Error cargando servicios:", err);
      }
    }
    cargarServicios();
  }, [perfilProveedor?.id]);

  useEffect(() => {
    async function cargarReservas() {
      if (!perfilProveedor?.id) return;
      try {
        const data = await getProveedorReservaById(perfilProveedor.id);
        setReservas(data);
      } catch (err) {
        console.error("Error cargando reservas:", err);
      }
    }
    cargarReservas();
  }, [perfilProveedor?.id]);

  const reservasPorServicio = useMemo(() => {
    const reservasActivas = reservas.filter(
      reserva => reserva.estadoReserva === "EN_CURSO"
    );
    return reservasActivas.reduce<Record<number, number>>((acc, reserva) => {
      const servicioId = Number(reserva.servicioId);
      if (Number.isNaN(servicioId)) return acc;
      acc[servicioId] = (acc[servicioId] || 0) + 1;
      return acc;
    }, {});
  }, [reservas]);

  async function handleEliminarServicio() {
    if (!servicioEliminar?.id) return;

    try {
      await eliminarServicio(servicioEliminar.id);
      setServices(prev =>
        prev.filter(service => service.id !== servicioEliminar.id)
      );
      setServicioEliminar(null);
    } catch (err) {
      console.error("Error eliminando servicio:", err);
    }
  }

  if (loading) { return (<div style={{ padding: "32px" }}>Cargando servicios...</div>); }

  if (error) { return (<div style={{ padding: "32px", color: "#dc2626" }}>Error al cargar servicios: {String(error)}</div>); }

  return (
    <div style={{ padding: "32px" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: "#0f172a" }}>
            Mis servicios
          </h1>
          <p style={{ marginTop: "6px", color: "#64748b" }}>
            Gestiona los servicios que ofreces.
          </p>
        </div>
        <button
          onClick={() => navigate("/crear-servicio")}
          style={{ display: "flex", alignItems: "center", border: "none", backgroundColor: "#2563eb", color: "#ffffff", padding: "14px 18px", borderRadius: "14px", cursor: "pointer", fontSize: "1rem", fontWeight: 700 }}
        >
          <Icon name="add" />Crear servicio
        </button>
      </div>
      {/* TABLA */}
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "22px", overflow: "hidden", backgroundColor: "#ffffff" }}>
        {/* HEADERS */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1.3fr auto", gap: "16px", padding: "16px 24px", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: "0.82rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <span>Título</span>
          <span>Categoría</span>
          <span>Ubicación</span>
          <span>Modalidad</span>
          <span>Reservas</span>
          <span style={{ textAlign: "right" }}>
            Acciones
          </span>
        </div>
        {/* ROWS */}
        {services.length === 0 ? (
          <div style={{ padding: "56px 24px", textAlign: "center", color: "#64748b" }}>
            No tienes servicios creados todavía.
          </div>
        ) : (
          services.map(service => (
            <ServicioRow
              key={service.id}
              service={service}
              totalReservas={reservasPorServicio[Number(service.id)] || 0}
              onEdit={() => navigate(`/editar-servicio/${service.id}`)}
              onDelete={() => setServicioEliminar(service)}
            />
          ))
        )}
      </div>
      {/* MODAL */}
      <EliminarServicioModal
        servicio={servicioEliminar as any}
        onClose={() => setServicioEliminar(null)}
        onConfirm={handleEliminarServicio}
      />
    </div>
  );
}