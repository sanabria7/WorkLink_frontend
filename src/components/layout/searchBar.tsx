import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SbKeyModal from "../modals/sb-KeyModal";
import SbPriceModal from "../modals/sb-PriceModal";
import Icon from "../misc/icon";
import SbServiceModal from "../modals/sb-ServiceModal";

export default function SearchBar() {
    const [palabra, setPalabra] = useState("");
    const [precio, setPrecio] = useState("");
    const [service, setService] = useState("");
    const [openModal, setOpenModal] = useState<null | "palabra" | "precio" | "service">(null);

    const navigate = useNavigate();

    async function handleSearch(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (!palabra && !service && !precio) {
            alert("¡Ups! Debes ingresar por lo menos un párametro de búsqueda."); 
            return;
        }
        const query = new URLSearchParams({palabra, precio, service}).toString();
        navigate(`/busqueda?${query}`);
        setOpenModal(null);
    }

    return (
        <form onSubmit={handleSearch} role="search" aria-label="Formulario de búsqueda">
            <div className="btn-searchbar" aria-label="Palabra clave" onClick={() => setOpenModal("palabra")}>
                <span>{palabra || "Palabra clave"}</span>
            </div>
            <div className="btn-searchbar" aria-label="Agregar categoria" onClick={() => setOpenModal("service")}>
                <span>{service || "Agregar categoria"}</span>
            </div>
            <div className="btn-searchbar" aria-label="Agregar precio" onClick={()=> setOpenModal("precio")}>
                <span>{precio && `$ ${precio}` || "Agregar precio"}</span>
            </div>
            <button type="submit" className="btn-primary" datatype="submit" aria-label="Buscar">
                <span style={{display:"flex"}}><Icon name="search"></Icon></span>
            </button>
            {/* Modales */}
            {openModal === "palabra" && (
                <SbKeyModal open={true} value={palabra} onChange={setPalabra} onClose={()=>setOpenModal(null)}/>
            )}
            {openModal === "precio" && (
                <SbPriceModal open={true} value={precio} onChange={setPrecio} onClose={()=>setOpenModal(null)}/>
            )}
            {openModal === "service" && (
                <SbServiceModal open={true} onChange={setService} onClose={()=>setOpenModal(null)}/>
            )}
        </form>
    );
}