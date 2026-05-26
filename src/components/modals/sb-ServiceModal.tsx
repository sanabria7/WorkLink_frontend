import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Icon from "../misc/icon";

interface SbServiceModalProps {
    open: boolean;
    onChange: (newValue: string) => void;
    onClose: () => void;
}

export default function SbServiceModal({ open, onChange, onClose }: SbServiceModalProps) {
    return (
        <Dialog open={!!open} onClose={onClose} >
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)" }} />
            <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "0", top: "10%" }}>
                <DialogPanel style={{ display: "flex", flexDirection: "column", background: "#fff", borderRadius: "0.5rem", padding: "0.8rem" }}>
                    <div style={{ padding: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <DialogTitle style={{ fontSize: "1.4rem", fontWeight: 600, margin: "0" }}>Elige una categoria</DialogTitle>
                        <button style={{ display: "flex", cursor: "pointer", justifyContent: "center", alignItems: "center", width: "32px", height: "32px", border: "none", backgroundColor: "f5f5f5", borderRadius: "999px" }}
                            onClick={onClose}><svg style={{ width: "28px", height: "28px" }}><Icon name="close"></Icon></svg>
                        </button>
                    </div>
                    <div style={{ padding: "12px 8px", display: "flex", justifyContent:"space-around", gap:"12px", borderTop: "1px solid #e5e7eb", marginTop:"8px"}}>
                        <button type="button" className="categoria_btn categoria_btn_arte" onClick={() => onChange("Arte")}>Arte</button>
                        <button type="button" className="categoria_btn categoria_btn_education" onClick={() => onChange("Educacion")}>Educación</button>
                        <button type="button" className="categoria_btn categoria_btn_evento" onClick={() => onChange("Eventos")}>Eventos</button>
                    </div>
                    <div style={{ display: "flex", justifyContent:"flex-end", gap:"10px", marginTop:"1rem"}}>
                        <button style={{ backgroundColor: "transparent", border: "none", textDecorationLine: "underline", cursor: "pointer", color: "#333", fontWeight:"600" }} type="reset"
                            onClick={() => onChange("")}>Limpiar</button>
                        <button style={{ display: "flex", borderRadius: "8px",cursor: "pointer", fontSize:"0.8rem", fontWeight:"600", color:"white", justifyContent: "center", alignItems: "center", width:"100px", height: "32px", border: "none", backgroundColor: "#0077ff" }}
                            onClick={onClose}>Aceptar</button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}