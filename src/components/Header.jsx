import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpeg";

function Header() {
  return (
    <header
      style={{
        borderBottom: "1px solid #ddd",
        padding: "10px 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link to="/">
        <img src={logo} alt="Ville de Montréal" style={{ height: "50px" }} />
      </Link>

      <button onClick={() => alert("Fonctionnalité non disponible.")}>
        Mon Compte
      </button>
    </header>
  );
}

export default Header;
