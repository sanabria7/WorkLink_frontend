import { useNavigate } from "react-router-dom";
import Icon from "../misc/icon";
import type { Service } from "../../types/serviceTypes";

interface Props {
    service: Service;
    totalReservas: number;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ServicioRow({ service, totalReservas, onEdit, onDelete }: Props) {
    const navigate = useNavigate();
    const tieneReservas = totalReservas > 0;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1.3fr auto", alignItems: "center", gap: "16px", padding: "18px 24px", borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s ease" }}>
            {/* TITULO */}
            <button
                onClick={() => navigate(`/servicio/${service.id}`)}
                style={{ border: "none", background: "transparent", padding: 0, textAlign: "left", cursor: "pointer", minWidth: 0 }}
            >
                <div style={{ fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {service.titulo}
                </div>
            </button>
            {/* CATEGORIA */}
            <div style={{ color: "#334155", fontWeight: 500 }}>
                {service.categoria}
            </div>
            {/* UBICACION */}
            <div style={{ color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {service.ubicacion}
            </div>
            {/* MODALIDAD */}
            <div style={{ color: "#334155" }}>
                {service.modalidad}
            </div>
            {/* RESERVAS */}
            <div>
                {tieneReservas ? (
                    <button
                        onClick={() => navigate("/calendario")}
                        style={{ border: "none", background: "transparent", padding: 0, color: "#2563eb", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}
                    >
                        Ver calendario ({totalReservas})
                    </button>
                ) : (
                    <span style={{ color: "#94a3b8", fontSize: "0.92rem" }}>
                        Este servicio no tiene reservas
                    </span>

                )}
            </div>
            {/* ACCIONES */}
            <div style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
                <button
                    onClick={onEdit}
                    style={{ width: "42px", height: "42px", color: "#2563eb", textDecoration: "underline",border: "none", fontWeight: 600, backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    Editar
                </button>
                <button
                    onClick={onDelete}
                    disabled={tieneReservas}
                    style={{ width: "42px", height: "42px", borderRadius: "12px", border: "1px solid #fee2e2", backgroundColor: tieneReservas ? "#f8fafc" : "#ffffff", color: tieneReservas ? "#94a3b8" : "#dc2626", cursor: tieneReservas ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: tieneReservas ? 0.6 : 1 }}
                >
                    <Icon name="delete" />
                </button>

            </div>

        </div>
    );
}