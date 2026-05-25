import Icon from "../misc/icon";

interface SbServiceModalProps {
    onChange: (newValue: string) => void;
    onClose: () => void;
}

export default function SbServiceModal({ onChange, onClose }: SbServiceModalProps) {
    return (
        <div className="searchBar_modal searchBar_modal_center">
            <button type="button" className="categoria_btn categoria_btn_arte" onClick={() => onChange("Arte")}>Arte</button>
            <button type="button" className="categoria_btn categoria_btn_education" onClick={() => onChange("Educacion")}>Educación</button>
            <button type="button" className="categoria_btn categoria_btn_evento" onClick={() => onChange("Eventos")}>Eventos</button>
            <button style={{backgroundColor: "transparent", border: "none", textDecorationLine:"underline", cursor:"pointer", color:"#0077ff"}} type="reset" onClick={() => onChange("")}>Limpiar</button>
            <button style={{ display: "flex", cursor: "pointer", justifyContent: "center", alignItems: "center", width: "32px", height: "32px", border: "none", backgroundColor: "f5f5f5", borderRadius: "999px" }}
                onClick={onClose}><Icon name="close"></Icon></button>
        </div>
    );
}