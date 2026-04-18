import { Link } from "react-router-dom";

export default function Panel() {
    return (
            <nav className="nav-panel">
                <ul className="nav-links">
                    <li><Link to="/mis-servicios">Servicios</Link></li>
                    <li><Link to="/calendario" >Calendario</Link></li>
                </ul>
            </nav>        
    );
}