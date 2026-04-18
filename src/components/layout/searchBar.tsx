import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SbKeyModal from "../modals/sb-KeyModal";
import SbDateTimeModal from "../modals/sb-DateTimeModal";
import Icon from "../misc/icon";
import SbServiceModal from "../modals/sb-ServiceModal";

export default function SearchBar() {
    const [palabra, setPalabra] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [service, setService] = useState("");
    const [openModal, setOpenModal] = useState<null | "palabra" | "dateTime" | "service">(null);

    const navigate = useNavigate();

    async function handleSearch(evento: React.SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        const query = new URLSearchParams({palabra, date: dateTime, service}).toString();
        navigate(`/busqueda?${query}`);
        setPalabra("");
        setOpenModal(null);
    }

    return (
        <form onSubmit={handleSearch} role="search" aria-label="Formulario de búsqueda">
            <div className="btn-searchbar" aria-label="Palabra clave" onClick={() => setOpenModal("palabra")}>
                <span>{palabra || "Palabra clave"}</span>
            </div>
            <div className="btn-searchbar" aria-label="Agregar fecha" onClick={()=> setOpenModal("dateTime")}>
                <span>{dateTime || "Agregar fecha"}</span>
            </div>
            <div className="btn-searchbar" aria-label="Agregar servicio" onClick={() => setOpenModal("service")}>
                <span>{service || "Agregar servicio"}</span>
            </div>
            <button type="submit" className="btn-primary" datatype="submit" aria-label="Buscar">
                <span><Icon name="search"></Icon></span>
            </button>
            {/* Modales */}
            {openModal === "palabra" && (
                <SbKeyModal value={palabra} onChange={setPalabra} onClose={()=>setOpenModal(null)}/>
            )}
            {openModal === "dateTime" && (
                <SbDateTimeModal value={dateTime} onChange={setDateTime} onClose={()=>setOpenModal(null)}/>
            )}
            {openModal === "service" && (
                <SbServiceModal onChange={setService} onClose={()=>setOpenModal(null)}/>
            )}
        </form>
    );
}