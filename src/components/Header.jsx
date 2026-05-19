import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpeg";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Ville de Montréal" className="header-logo" />
      </Link>
      <button onClick={() => alert("Fonctionnalité non disponible.")}>
        Mon Compte
      </button>
    </header>
  );
}

export default Header;
