import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/authProvider"
import { useState } from "react"
import { crearHorarios } from "../../api/horariosService";
import Icon from "../misc/icon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

const diasSemana = [
    { id: 1, nombre: "Lunes" },
    { id: 2, nombre: "Martes" },
    { id: 3, nombre: "Miércoles" },
    { id: 4, nombre: "Jueves" },
    { id: 5, nombre: "Viernes" },
    { id: 6, nombre: "Sábado" },
    { id: 7, nombre: "Domingo" },
];
export default function ConfigurarHorarios() {
    const { perfilProveedor } = useAuth();
    const navigate = useNavigate();

    const [diasLaborales, setDiasLaborales] = useState<number[]>([]);
    const [horaInicio, setHoraInicio] = useState<Date | null>(null);
    const [horaFin, setHoraFin] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorResponse, setErrorResponse] = useState<string | null>(null);

    const toggleDia = (id: number) => {
        setDiasLaborales((prev) =>
            prev.includes(id) ? prev.filter((dia) => dia != id) : [...prev, id]
        );
    };

    async function handleSubmit(evento: React.SubmitEvent) {
        evento.preventDefault();
        if (!perfilProveedor?.id) {
            setErrorResponse("No se encontró ID del proveedor");
            return;
        }
        if (diasLaborales.length === 0) {
            setErrorResponse("Debes seleccionar al menos un día laboral");
            return;
        }        
        if (!horaInicio || !horaFin) {
            setErrorResponse("Debes seleccionar hora de inicio y fin");
            return;
        }
        if (horaInicio >= horaFin) {
            setErrorResponse("La hora de fin debe ser mayor a la hora de inicio");
            return;
        }
	setLoading(true);
        setErrorResponse(null);
        try {
            const payload = {
                diasLaborales,
                horaInicio: horaInicio.toLocaleTimeString("es-Es", { hour: "2-digit", minute: "2-digit" }),
                horaFin: horaFin.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
                idProveedor: perfilProveedor.id,
            };
            await crearHorarios(payload);
            alert("Horarios configurados correctamente");
            navigate("/calendario");
        } catch (error: any) {
            console.error(error);
            setErrorResponse(error.response.data.message || "Error al guardar los horarios");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <div style={{ maxWidth: "42rem", margin: "2.5rem auto", padding: "2rem", backgroundColor: "#ffffff", borderRadius: "1.5rem", boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    <Icon name="calendar" />
                    <h1 style={{ fontSize: "1.875rem", fontWeight: "700" }}>Configurar Horarios</h1>
                </div>
                <p style={{ color: "#4b5563", marginBottom: "2rem" }}>
                    Define los días y el rango horario en el que estás disponible.
                </p>
                {errorResponse && (
                    <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "1rem" }}>
                        {errorResponse}
                    </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {/* Días laborales */}
                    <div>
                        <label style={{ display: "block", fontSize: "1.125rem", fontWeight: "500", marginBottom: "0.75rem" }}>
                            Días laborales
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                            {diasSemana.map((dia) => (
                                <label
                                    key={dia.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        padding: "1rem",
                                        border: "1px solid",
                                        borderColor: diasLaborales.includes(dia.id) ? "#2563eb" : "#e5e7eb",
                                        borderRadius: "1rem",
                                        cursor: "pointer",
                                        backgroundColor: diasLaborales.includes(dia.id) ? "#eff6ff" : "#ffffff",
                                        transition: "0.2s"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={diasLaborales.includes(dia.id)}
                                        onChange={() => toggleDia(dia.id)}
                                        style={{ width: "1.25rem", height: "1.25rem", accentColor: "#2563eb" }}
                                    />
                                    <span style={{ fontWeight: "500" }}>{dia.nombre}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Horas */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                                Hora de inicio
                            </label>
                            <TimePicker
                                value={horaInicio}
                                onChange={setHoraInicio}
                                minutesStep={30}
                                ampm={false}
                                slotProps={{
                                    textField: { fullWidth: true }
                                }}
                                sx={{ width: "100%" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                                Hora de fin
                            </label>
                            <TimePicker
                                value={horaFin}
                                onChange={setHoraFin}
                                minutesStep={30}
                                ampm={false}
                                slotProps={{
                                    textField: { fullWidth: true }
                                }}
                                sx={{ width: "100%" }}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", paddingTop: "1.5rem" }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: "1rem",
                                fontSize: "1.125rem",
                                fontWeight: "600",
                                backgroundColor: "#2563eb",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "1rem",
                                opacity: loading ? 0.5 : 1,
                                cursor: "pointer"
                            }}
                        >
                            {loading ? "Guardando horarios..." : "Guardar horarios"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/calendario")}
                            style={{
                                flex: 1,
                                padding: "1rem",
                                fontSize: "1.125rem",
                                fontWeight: "500",
                                border: "1px solid #d1d5db",
                                borderRadius: "1rem",
                                cursor: "pointer"
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </LocalizationProvider>
    );
}