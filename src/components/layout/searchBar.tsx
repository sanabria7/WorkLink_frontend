import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SbLocationModal from "../modals/sb-LocationModal";
import SbDateTimeModal from "../modals/sb-DateTimeModal";
import Icon from "../misc/icon";

export default function SearchBar() {

    const [location, setLocation] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [service, setService] = useState("");
    const [openModal, setOpenModal] = useState<null | "location" | "dateTime" | "service">(null);

    const navigate = useNavigate();

    function handleSearch(evento: React.SubmitEvent<HTMLFormElement>): void {
        evento.preventDefault();
        const query = new URLSearchParams({location, date: dateTime, service}).toString();
        navigate(`/busqueda?${query}`);
    }

    return (
        <form onSubmit={handleSearch} role="search" aria-label="Formulario de búsqueda">
            <button type="button" className="btn-searchbar" aria-label="Agregar ubicación" onClick={() => setOpenModal("location")}>
                <span>{location || "Agregar ubicación"}</span>
            </button>
            <button type="button" className="btn-searchbar" aria-label="Agregar fecha" onClick={()=> setOpenModal("dateTime")}>
                <span>{dateTime || "Agregar fecha"}</span>
            </button>
            <button type="button" className="btn-searchbar" aria-label="Agregar servicio" onClick={() => setOpenModal("service")}>
                <span>{service || "Agregar servicio"}</span>
            </button>
            <button type="submit" className="btn-primary" datatype="submit" aria-label="Buscar">
                <span><Icon name="search"></Icon></span>
            </button>
            {/* Modales */}
            {openModal === "location" && (
                <SbLocationModal value={location} onChange={setLocation} onClose={()=>setOpenModal(null)}></SbLocationModal>
            )}
            {openModal === "dateTime" && (
                <SbDateTimeModal value={dateTime} onChange={setDateTime} onClose={()=>setOpenModal(null)}></SbDateTimeModal>
            )}
            {openModal === "service" && (
                <></>
            )}
        </form>
    );
}