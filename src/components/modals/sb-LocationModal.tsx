import Icon from "../misc/icon";

interface SbLocationModalProps {
    value: string;
    onChange: (newValue: string) => void;
    onClose: () => void;
}

export default function SbLocationModal({ value, onChange, onClose }: SbLocationModalProps) {
    return (
        <>
            <strong>Selecciona tu ubicación</strong>
            <input
                type="search"
                placeholder="Explora destinos"
                value={value}
                onChange={(evento) => onChange(evento.target.value)}
            />
            <button style={{ display: "flex", cursor: "pointer", justifyContent: "center" , alignItems: "center", width: "32px", height:"32px", border: "none", backgroundColor: "f5f5f5", borderRadius: "999px"}}
            onClick={onClose}><Icon name="close"></Icon></button>
        </>
    );
} 