import { useEffect, useState } from "react";
import type { Service } from "../../types/serviceTypes";
import FlechaIcon from "../../assets/landing-imagen/icons/flecha-foward.svg"
import { listarPorCategoria } from "../../api/offerService";
import ServiceCard from "./ServiceCard";

interface ContainerServiceProps{
    categoria: string;
}

export default function ContainerServiceCard({categoria} : ContainerServiceProps) {

    const [services, setServices] = useState<Service[]>([]);
    const [position, setPosition] = useState<number>(0);

    useEffect(() =>{
        listarPorCategoria(categoria).then((data) => setServices(data))
        .catch((error) => console.log(error))
    }, [])
    
    return (
        <div className="content9">
            <div className="container43">
                <div className="container37">
                    {categoria=="Educacion" && <div className="arte-diseo">Educación</div>}
                    {categoria=="Arte" && <div className="arte-diseo">Arte & Diseño</div>}
                    {categoria=="Eventos" && <div className="arte-diseo">Organización de Eventos</div>}
                </div>
                <div className="container44">
                    <div className={position<0 ? "button-component11": "button-component10 vector-icon-dis"} onClick={() => position<0 && setPosition(position+369)}>
                        <div className="search">
                            <img className="vector-icon7" alt="" src={FlechaIcon}/>

                        </div>
                    </div>
                    <div className={ position> (-369*(services.length-4)) ? "button-component11": "button-component10 vector-icon-dis"} onClick={() => position> (-369*(services.length-4)) &&  setPosition(position-369)}>
                        <div className="search">
                            <img className="vector-icon8" alt="" src={FlechaIcon}/>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className={`container-${categoria}`} style={{transform: `translateX(${position}px)`}}>
                
                {services.length!== 0 && services.map(servicio => {
                    return(
                        <ServiceCard key={servicio.id} servicio={servicio}></ServiceCard>
                    )
                })}
                {services.length===0 && <div style={{fontSize: "18px"}}>No hay servicios con categoria {categoria} que mostrar</div>}


            </div>
        </div>
    )
}