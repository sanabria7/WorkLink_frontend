import { Link } from "react-router-dom";

export default function Panel() {
    return (
            <nav className="nav-panel">
                <ul className="nav-links">
                    <li><Link to="/mis-servicios">Calendario</Link></li>
                    <li><a href="#servicios">Servicios</a></li>
                    <li><a href="#mensaje">Mensaje</a></li>
                </ul>
            </nav>        
    );
}