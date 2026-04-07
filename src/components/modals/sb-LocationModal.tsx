interface SbLocationModalProps {
    value: string;
    onChange: (newValue: string) => void;
    onClose: () => void;
}

export default function SbLocationModal({ value, onChange, onClose }: SbLocationModalProps) {
    return (
        <>
            <h2>Selecciona tu ubicación</h2>
            <input
                type="search"
                placeholder="Explora destinos"
                value={value}
                onChange={(evento) => onChange(evento.target.value)}
            />
            <button onClick={onClose}>X</button>
        </>
    );
} 