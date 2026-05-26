import { Dialog } from "@headlessui/react";
import type { Service } from "../../types/serviceTypes";
import Icon from "../misc/icon";

interface Props {
    servicio: Service | null;
    onClose: () => void;
    onConfirm: () => void;
}

export default function EliminarServicio({ servicio, onClose, onConfirm }: Props) {
    return (
        <Dialog open={!!servicio} onClose={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "rgba(0,0,0,0.6)" }}>
                <div style={{ width: "100%", maxWidth: "500px", backgroundColor: "white", borderRadius: "24px", padding: "2rem" }}>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>
                        Eliminar servicio
                    </h2>
                    <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
                        ¿Seguro que deseas eliminar el servicio <strong>{servicio?.titulo}</strong>?
                    </p>
                    <div style={{ display: "flex", justifyContent: "end", gap: "1rem" }}>
                        <button onClick={onClose} style={{ padding: "10px 18px", borderRadius: "10px", cursor:"pointer", border: "1px solid #d1d5db" }}>
                            Cancelar
                        </button>
                        <button onClick={onConfirm} style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ef4444", color: "white", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: 400, cursor:"pointer" }}>
                            <Icon name="delete" />Sí, eliminar
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}