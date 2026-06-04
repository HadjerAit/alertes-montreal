import "./BarreRecherche.css";

function BarreRecherche({ recherche, setRecherche }) {
  return (
    <input
      type="text"
      placeholder="Que cherchez-vous?"
      value={recherche}
      onChange={(e) => setRecherche(e.target.value)}
      className="barre-recherche"
    />
  );
}

export default BarreRecherche;
