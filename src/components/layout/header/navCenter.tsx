import SearchBar from "../searchBar";
import Panel from "../panel";
import { useAuth } from "../../../auth/authProvider";

export default function NavCenter() {
  const {isAuthenticated, user} = useAuth();
  return (
    <div className="navbar-center">
      {isAuthenticated && user?.rol === "proveedor" ? <Panel /> : <SearchBar />}
    </div>
  );
}
