import Icon from "../misc/icon";

interface SbKeyModalProps {
    value: string;
    onChange: (newValue: string) => void;
    onClose: () => void;
}

export default function SbKeyModal({ value, onChange, onClose }: SbKeyModalProps) {
    return (
        <>
            <strong>Búsqueda por palabra clave</strong>
            <input
                style={{width:"20%"}}
                type="search"
                placeholder="Encuentra por palabra clave"
                value={value}
                onChange={(evento) => onChange(evento.target.value)}
            />
            <button style={{ display: "flex", cursor: "pointer", justifyContent: "center", alignItems: "center", width: "32px", height: "32px", border: "none", backgroundColor: "f5f5f5", borderRadius: "999px" }}
                onClick={onClose}><Icon name="close"></Icon></button>
        </>
    );
} 