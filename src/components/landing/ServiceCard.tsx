import type { Service } from "../../types/serviceTypes";

interface ServiceCardProps{
    servicio: Service;
}

export default function ServiceCard({servicio}: ServiceCardProps) {

    return (
        <div className="servicecard">
            <div className="container45">
                <div className="text">
                    <div className="education">{servicio.categoria}</div>
                </div>
                <div className="button-component12">
                    <div className="search">
                        <img className="vector-icon9" alt="" />

                    </div>
                </div>
            </div>
            <div className="container46">
                <div className="container47">
                    <div className="heading-35">
                        <div className="tutora-de-matemticas">{servicio.titulo}</div>
                    </div>
                    <div className="container48">
                        <div className="icon">
                            <div className="star-filled">
                                <img className="vector-icon10" alt="" />

                            </div>
                        </div>
                        <div className="span">
                            <div className="div">4.9</div>
                        </div>
                        <div className="text3">
                            <div className="tienes-una-nueva">(127)</div>
                        </div>
                    </div>
                </div>
                <div className="paragraph4">
                    <div className="one-on-one-tutoring-sessions">{servicio.descripcion}</div>
                </div>
                <div className="container49">
                    <div className="span">
                        <div className="hr">
                            <span className="span10">$ {servicio.precio}</span>
                            <span className="hr2">/{servicio.duracion/60}hr</span>
                        </div>
                    </div>
                    <a className="button-component13" href={`http://localhost:5173/servicio/${servicio.id}`}>
                        <div className="span">
                            <div className="e">Reservar ahora</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}