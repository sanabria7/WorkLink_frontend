import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Service } from "../types/serviceTypes";
import { useService } from "../hooks/useService";

export default function ResultadosBusqueda() {
  const { buscarServicio, loading } = useService();
  const [resultados, setResultados] = useState<Service[]>([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const palabra = params.get("palabra") ?? "";

  useEffect(() => {
    let mounted = true;
    buscarServicio(palabra)
      .then((res) => mounted && setResultados(res))
      .catch((err) => {
        console.log("erro de mierda")
        console.error("Error en búsqueda:", err);
      });
    return () => {
      mounted = false;
    };
  }, [palabra, buscarServicio]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Resultados de búsqueda</h1>
      {loading ? (
        <p>Buscando servicios…</p>
      ) : resultados.length === 0  ? (
        <p>No se encontraron servicios{palabra ? ` para "${palabra}"` : ""}.</p>
      ) : (
      <>
        {resultados.length > 0 && palabra && (
          <p>
            <strong>{resultados.length}</strong> resultados encontrados para <em>"{palabra}"</em>
          </p>
        )}
        <section
          aria-label="Resultados de servicios"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {resultados.map((servicio) => (
            <article
              key={servicio.id}
              style={{
                border: "1px solid #e6e6e6",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Link to={`/servicio/${servicio.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
                  <img
                    src={/* servicio.imgUrl */ "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzYxNjQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                    alt={servicio.titulo}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <h2 style={{ fontSize: "1rem", margin: 0 }}>{servicio.titulo}</h2>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600 }}>
                      ${servicio.precio}
                    </span>
                    <span aria-label={`Valoración $/* {servicio.rating} */ de 5`} title={`$/* {servicio.rating} */ / 5`}> {/* cuando camilo agregue rating */}
                      ⭐ {/* servicio.rating */ 4.5}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </>
      )}
    </div>
  );
}
