import Icon from "../../misc/icon";

interface ReservaModalHeaderProps {
    servicioTitulo: string;
    duracionServicio: number;
    precioServicio: number;
    onClose: () => void;
}

export default function ReservaModalHeader({ servicioTitulo, duracionServicio, precioServicio, onClose, }: ReservaModalHeaderProps) {

    return (

        <div
            style={{
                padding: "20px 24px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px"
            }}
        >

            <div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "10px"
                    }}
                >

                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "999px",
                            backgroundColor: "#eff6ff",
                            display: "grid",
                            placeItems: "center"
                        }}
                    >
                        <Icon name="calendar" />
                    </div>

                    <div>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "1.2rem",
                                fontWeight: 800,
                                color: "#0f172a"
                            }}
                        >
                            Reservar servicio
                        </h2>

                        <p
                            style={{
                                margin: "4px 0 0",
                                color: "#64748b",
                                fontSize: "0.9rem"
                            }}
                        >
                            {servicioTitulo}
                        </p>

                    </div>

                </div>

                <p
                    style={{
                        margin: 0,
                        color: "#475569",
                        fontSize: "0.95rem",
                        lineHeight: 1.5
                    }}
                >
                    Selecciona una fecha y un horario disponible para continuar con tu reserva.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "14px"
                    }}
                >

                    <div
                        style={{
                            padding: "6px 10px",
                            borderRadius: "999px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            fontSize: "0.82rem",
                            color: "#334155"
                        }}
                    >
                        Duración: {duracionServicio} min
                    </div>

                    <div
                        style={{
                            padding: "6px 10px",
                            borderRadius: "999px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            fontSize: "0.82rem",
                            color: "#334155"
                        }}
                    >
                        ${precioServicio.toLocaleString("es-CO")}
                    </div>

                </div>

            </div>

            <button
                onClick={onClose}
                aria-label="Cerrar modal"
                style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "999px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    color: "#475569",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                }}
            >
                <Icon name="close" />
            </button>

        </div>
    );
}