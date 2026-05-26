import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authProvider";
import type { EstadisticasType } from "../../types/EstadisticasTypes";
import { getEstadisticasReservas } from "../../api/EstadisticasService";
import  "../../styles/estadisticas.css"
import CustomActivePieChart from "./PieChartActive";

export default function Estadisticas(){
    const {perfilProveedor} = useAuth();
    const [estadisticas, setEstadisticas] = useState<EstadisticasType>();
    const [titleService, setTitleService] = useState<string>("");

    useEffect(() =>{
        const id = perfilProveedor?.id;
        if(id){
            getEstadisticasReservas(id).then(data => setEstadisticas(data))
            .catch((error) => console.log(error))
        }
    },[perfilProveedor])

    return(
        <div className="estadisticas-container">
            <div className="header-estadisticas">
                <h1>Panel de Control del Proveedor: {perfilProveedor?.usuario.nombre +" " +perfilProveedor?.usuario.apellido}</h1>
            </div>
            <div className="title_desc">

                <h1>tus estadísticas como proveedor</h1>
                <p>Visualiza el rendimiento de tus servicios y reservas.</p>
            </div>
            <div className="dashboard">
                
                <div className="metrics">
                <div className="metric-card">
                    <h2>{estadisticas?.totalReservas}</h2>
                    <p>Total de reservas</p>
                </div>
                <div className="metric-card">
                    <h2>$ {estadisticas && new Intl.NumberFormat("es-CO").format(estadisticas.totalDineroGenerado)}</h2>
                    <p>Dinero generado</p>
                </div>
                <div className="metric-card">
                    <h2>{estadisticas?.totalReservas && "90%" || "-"}</h2>
                    <p>Satisfacción</p>
                </div>
                <div className="metric-card">
                    <h2>{estadisticas && estadisticas.porcentajePorEstado && estadisticas.porcentajePorEstado.COMPLETADA.toFixed(1) || 0}%</h2>
                    <p>Servicios completados</p>
                </div>
                </div>
                                <div className="charts">
                <div className="placeholder">
                    <h4 className="title_grafic">Gráfico: porcentaje de reservas por servicio</h4>
                    <h4 className="service_title">{titleService}</h4>
                    <div className="container-Piecharts">
                        {estadisticas?.porcentajePorServicio &&
                            <CustomActivePieChart 
                                data={estadisticas && Object.entries(estadisticas.porcentajePorServicio).map(([name, value]) => ({name, value, }))} 
                                totalReservas={estadisticas?.totalReservas}
                                setTitleService={setTitleService}
                            />
                            }

                    </div>

                    
                </div>
                <div className="placeholder">
                    <h4 className="title_grafic">Gráfico: porcentaje de reservas por Estado</h4>
                    <div className="container-Piecharts">
                        {estadisticas?.porcentajePorEstado && 
                        <CustomActivePieChart 
                            data={estadisticas && Object.entries(estadisticas.porcentajePorEstado).map(([name, value]) => ({name, value, }))} 
                            totalReservas={estadisticas?.totalReservas}
                            setTitleService={undefined}/>
                        }

                    </div>
                </div>
                </div>

                
                <div className="notifications">

                </div>
            </div>
        </div>
    )
}
