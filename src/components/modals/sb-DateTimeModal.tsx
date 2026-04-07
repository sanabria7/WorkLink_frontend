interface SbDateTimeModalProps {
    value: string;
    onChange: (newValue: string) => void;
    onClose: () => void;
}

export default function SbDateTimeModal({ value, onChange, onClose } : SbDateTimeModalProps) {
    return (
        <>
            <h2>Selecciona tu ubicación</h2>
            <input
                type="datetime-local"
                placeholder="Elige una fecha"
                value={value}
                onChange={(evento) => onChange(evento.target.value)}
            />
            <button onClick={onClose}>X</button>
        </>
    );
}