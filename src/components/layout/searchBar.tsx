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
                <span><Icon name="search"></Icon></span>
            </button>
            {/* Modales */}
            {openModal === "palabra" && (
                <SbKeyModal value={palabra} onChange={setPalabra} onClose={()=>setOpenModal(null)}/>
            )}
            {openModal === "precio" && (
                <SbPriceModal value={precio} onChange={setPrecio} onClose={()=>setOpenModal(null)}/>
            )}
            {openModal === "service" && (
                <SbServiceModal  onChange={setService} onClose={()=>setOpenModal(null)}/>
            )}
        </form>
    );
}