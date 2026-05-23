import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import Icon from "../misc/icon";

interface Props {
  open: boolean;
  start: Date;
  end: Date;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function AddDisponibilidadDialog({ open, start, end, onClose, onConfirm, loading }: Props) {
  const fecha = start.toLocaleDateString("es-ES");
  const horaInicio = start.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const horaFin = end.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const slotsEstimados =
    end && start && end > start
      ? Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 30))
      : 0;

  return (
    <Dialog open={!!open} onClose={onClose}>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DialogPanel style={{ background: "#fff", borderRadius: "1.2rem", padding: "1.5rem", width: "100%", maxWidth: "32rem" }}>
          <DialogTitle style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            ¿Deseas agregar disponibilidad para el {fecha}?
          </DialogTitle>
          <Description style={{ fontSize: "0.9rem", color: "#4B5563", marginBottom: "1rem" }}>
            <strong>Inicio de horario:</strong> {horaInicio} &nbsp;
            <strong>Fin de horario:</strong> {horaFin}
          </Description>
          <div style={{ display:"flex", alignItems:"center", gap: "2px", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "0.6rem 0.8rem", borderRadius: "0.6rem", fontSize: "0.8rem", color: "#1e3a8a", marginBottom: "0.8rem" }}>
            <Icon name="info"/> Serán creados <strong>{slotsEstimados}</strong> slots de 30 minutos.
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{ flex: 1, padding: "0.7rem", borderRadius: "0.7rem", border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Agregando..." : "Aceptar"}
            </button>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: "0.7rem", borderRadius: "0.7rem", border: "1px solid #d1d5db", background: "#fff", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer" }}
            >
              Cancelar
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>

  );
}