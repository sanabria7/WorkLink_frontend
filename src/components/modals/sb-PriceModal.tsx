import Icon from "../misc/icon";

interface SbPriceModalProps {
    value: string;
    onChange: (newValue: string) => void;
    onClose: () => void;
}

export default function SbPriceModal({ value, onChange, onClose }: SbPriceModalProps) {
    return (
        <div className="searchBar_modal searchBar_modal_right">
            <strong>Buscar por precio</strong>
            <input
                type="number"
                inputMode="numeric"
                placeholder="Digite el precio"
                autoFocus
                value={value}
                onChange={(evento) => onChange(evento.target.value)}
            />
            <button style={{ display: "flex", cursor: "pointer", justifyContent: "center", alignItems: "center", width: "32px", height: "32px", border: "none", backgroundColor: "f5f5f5", borderRadius: "999px" }}
                onClick={onClose}><Icon name="close"></Icon></button>
        </div>
    );
}