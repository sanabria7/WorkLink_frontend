interface ReservaFooterProps {
    disabled: boolean;
    submitting: boolean;
    onClose: () => void;
    onReservar: () => void;
}

export default function ReservaFooter({ disabled, submitting, onClose, onReservar }: ReservaFooterProps) {

    return (

        <div
            style={{
                borderTop: "1px solid #e5e7eb",
                padding: "16px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap"
            }}
        >

            <button
                onClick={onClose}
                style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    fontWeight: 600,
                    cursor: "pointer"
                }}
            >
                Cancelar
            </button>

            <button
                onClick={onReservar}
                disabled={disabled}
                style={{
                    minWidth: "170px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor:
                        disabled
                            ? "#cbd5e1"
                            : "#2563eb",

                    color:
                        disabled
                            ? "#64748b"
                            : "#ffffff",

                    fontWeight: 700,

                    cursor:
                        disabled
                            ? "not-allowed"
                            : "pointer",
                }}
            >
                {submitting
                    ? "Procesando..."
                    : "Reservar ahora"}
            </button>

        </div>
    );
}