import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { busquedaServiceRequest, Service } from "../types/serviceTypes";
import { useService } from "../hooks/useService";
import ServiceCard from "../components/landing/ServiceCard";

export default function ResultadosBusqueda() {
  const { buscarServicio, loading } = useService();
  const [resultados, setResultados] = useState<Service[]>([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const palabra = params.get("palabra") ?? "";
  const precio = (params.get("precio")) ?? "";
  const categoria = params.get("service") ?? "";

  useEffect(() => {
    let mounted = true;
    const busqueda: busquedaServiceRequest = {
      query: palabra,
      precio: precio === "" ? 0.0 : parseFloat(precio),
      categoria: categoria === "" ? "TODOS" : categoria
    }
    console.log(busqueda)
    buscarServicio(busqueda)
      .then((res) => mounted && setResultados(res))
      .catch((err) => {
        console.log("erro de mierda")
        console.error("Error en búsqueda:", err);
      });
    return () => {
      mounted = false;
    };
  }, [palabra, precio, categoria, buscarServicio]);

  return (
    <div style={{ padding: "1rem", marginInline:"4rem" }}>
      <h1>Resultados de búsqueda</h1>
      {loading ? (
        <p>Buscando servicios…</p>
      ) : resultados.length === 0 ? (
        <p>No se encontraron servicios{palabra ? ` para "${palabra}"` : ""}.</p>
      ) : (
        <>
          {resultados.length > 0 && palabra && (
            <p style={{fontSize:"0.9rem", color:"#505661"}}>
              <strong style={{color:"black"}}>{resultados.length}</strong> resultados encontrados para <em><strong style={{color:"black"}}>"{palabra}"</strong></em>
            </p>
          )}
          <section aria-label="Resultados de servicios" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(1fr))", gap: "1rem", marginTop: "1rem", }}>
            {resultados.map((servicio) => (
              <article
                key={servicio.id}
                style={{ border: "none", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "row", height: "100%", width:"fit-content", gap:"10px", flexWrap:"wrap" }}
              >
                <Link to={`/servicio/${servicio.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <ServiceCard servicio={servicio} />
                </Link>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
