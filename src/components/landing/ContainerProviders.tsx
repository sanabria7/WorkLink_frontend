import { useEffect, useState } from "react"
import ProviderCard from "./ProviderCard"
import type { ProfileProveedor } from "../../types/userTypes";
import { obtenerTodosProveedores } from "../../api/profilesService";

export default function ContainerProviders() {

    const [providers, setProviders] = useState<ProfileProveedor[]>([]);

    useEffect(() =>{
        obtenerTodosProveedores().then((data) => setProviders(data))
    }, [])

    return (
        <div className="popularproviders">
            <div className="container145">
                <div className="heading-24">
                    <div className="arte-diseo">Proveedores Populares</div>
                </div>
                <div className="paragraph19">
                    <div className="meet-our-highest-rated">Conoce a nuestros proveedores de servicios mejor valorados por los clientes.</div>
                </div>
            </div>
            <div className="container146">
                {providers.length !==0 && providers.map((provider) => <ProviderCard proveedor={provider}></ProviderCard>)}
                
            </div>
        </div>
    )
}