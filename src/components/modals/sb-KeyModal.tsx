import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Icon from "../misc/icon";

interface SbKeyModalProps {
    value: string;
    open: boolean;
    onChange: (newValue: string) => void;
    onClose: () => void;
}

export default function SbKeyModal({ value, open, onChange, onClose }: SbKeyModalProps) {
    return (
        <Dialog open={!!open} onClose={onClose}>
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)" }} />
            <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "0", right: "40%", top: "10%" }}>
                <DialogPanel style={{ background: "#fff", borderRadius: "0.5rem", padding: "0.8rem", width: "100%", maxWidth: "32rem" }}>
                    <div style={{ padding: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <DialogTitle style={{ fontSize: "1.4rem", fontWeight: 600, margin: "0" }}>Búsqueda por palabra clave</DialogTitle>
                        <button style={{ display: "flex", cursor: "pointer", justifyContent: "center", alignItems: "center", width: "32px", height: "32px", border: "none", backgroundColor: "f5f5f5", borderRadius: "999px" }}
                            onClick={onClose}><svg style={{ width: "28px", height: "28px" }}><Icon name="close"></Icon></svg>
                        </button>
                    </div>
                    <div style={{ padding: "12px 8px", display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid #e5e7eb", marginTop: "8px" }}>
                        <p style={{ margin: 0, fontSize: "0.9rem" }}>Encuentra servicios de tu interés escribiendo una palabra clave</p>
                        <input
                            style={{ width: "100%", height: "32px", padding: "12px", outline: "none", fontSize: "0.8rem", border: "2px solid #60b5ff", borderRadius: "8px" }}
                            type="search"
                            placeholder="por ej. fotografía, clases, decoración, etc."
                            autoFocus
                            value={value}
                            onChange={(evento) => onChange(evento.target.value)}
                            onKeyDown={(e) => { 
                                if (e.key === "Enter") { 
                                    e.preventDefault(); 
                                    onClose() 
                                } 
                            }}
                        />
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
} 