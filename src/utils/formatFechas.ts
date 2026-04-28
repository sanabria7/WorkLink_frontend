import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatHora(hora?: string) {
    if (!hora) return "-";

    return format(
        parseISO(`1970-01-01T${hora}`),
        "hh:mm a"
    )
        .replace("AM", "a. m.")
        .replace("PM", "p. m.");
}

export function formatFecha(fecha?: string) {
    if (!fecha) return "-";

    return format(parseISO(fecha), "dd MMMM yyyy", {
        locale: es,
    });
}

export function formatRangoHora(rango: string){
    if (!rango) return "";

    const [inicio, fin] = rango.split(" - ");
    const formatHora = (hora: string) => {
        const [h, m] = hora.split(":");
        const fecha = new Date();
        fecha.setHours(Number(h), Number(m));

        return fecha.toLocaleTimeString("es-CO", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (!fin) return formatHora(inicio);
    
    return `${formatHora(inicio)} - ${formatHora(fin)}`;
}