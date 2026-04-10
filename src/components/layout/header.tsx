import NavCenter from "./header/navCenter";
import NavLeft from "./header/navLeft";
import NavRight from "./header/navRight";

export default function Header() {

  return (
    <header className="header">
      <nav className="navbar" aria-label="Navegación Principal">
        <NavLeft />
        <NavCenter />
        <NavRight />
      </nav>
    </header>
  );
}
