type PropsDurationSelect = {
    value: number | "";
    onChange: (value: number) => void;
};

export default function DurationSelect({ value, onChange, }: PropsDurationSelect) {
    const options = [
        { label: "30 min", value: 30},
        { label: "1 hora", value: 60},
        { label: "1 hr y 30 min", value: 90},
        { label: "2 horas", value:120 },
        { label: "3 horas", value: 180},
        { label: "4 horas", value: 240 },
        { label: "5 horas", value: 300},
        { label: "6 horas", value: 360},
        { label: "7 horas", value: 420},
        { label: "8 horas", value: 480},
        { label: "12 horas", value: 720},
        { label: "16 horas", value: 960},
        { label: "24 horas", value: 1440},
        { label: "2 días o más", value: 2880},
    ]

    return (
        <select
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            required
        >
            <option value="" disabled hidden>
                -- Selecciona la duración del servicio --
            </option>

            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}