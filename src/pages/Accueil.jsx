import { useState, useEffect } from "react";
import { getAlertes } from "../services/alertes";
import BarreRecherche from "../components/BarreRecherche";
import Filtres from "../components/Filtres";
import CarteAlerte from "../components/CarteAlerte";
import "./Accueil.css";

function Accueil() {
  const [alertes, setAlertes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [filtreArrondissement, setFiltreArrondissement] = useState("");
  const [filtreSujet, setFiltreSujet] = useState("");
  const [filtreDebut, setFiltreDebut] = useState("");
  const [filtreFin, setFiltreFin] = useState("");

  useEffect(() => {
    getAlertes().then((data) => {
      setAlertes(data);
      setChargement(false);
    });
  }, []);

  const listeArr = [...new Set(alertes.map((a) => a.arrondissement))];
  const listeSujets = [...new Set(alertes.map((a) => a.sujet))];

  function enleverAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const resultats = alertes.filter((alerte) => {
    const okRecherche = enleverAccents(alerte.titre.toLowerCase()).includes(
      enleverAccents(recherche.toLowerCase()),
    );
    const okArr =
      filtreArrondissement === "" ||
      alerte.arrondissement === filtreArrondissement;
    const okSujet = filtreSujet === "" || alerte.sujet === filtreSujet;
    const okDebut = filtreDebut === "" || alerte.dateEmission >= filtreDebut;
    const okFin = filtreFin === "" || alerte.dateEmission <= filtreFin;
    return okRecherche && okArr && okSujet && okDebut && okFin;
  });

  function resetFiltres() {
    setRecherche("");
    setFiltreArrondissement("");
    setFiltreSujet("");
    setFiltreDebut("");
    setFiltreFin("");
  }
  if (chargement) return <p>Chargement...</p>;

  return (
    <div className="accueil">
      <h1>Avis et alertes</h1>

      <BarreRecherche recherche={recherche} setRecherche={setRecherche} />

      <Filtres
        arrondissements={listeArr}
        sujets={listeSujets}
        filtreArrondissement={filtreArrondissement}
        setFiltreArrondissement={setFiltreArrondissement}
        filtreDebut={filtreDebut}
        setFiltreDebut={setFiltreDebut}
        filtreFin={filtreFin}
        setFiltreFin={setFiltreFin}
        filtreSujet={filtreSujet}
        setFiltreSujet={setFiltreSujet}
        reinitialiserFiltres={resetFiltres}
      />

      <p className="resultats">
        {resultats.length} résultat(s)
        <button
          className="abonner"
          onClick={() => alert("Abonnement pas disponible.")}
        >
          M'abonner →
        </button>
      </p>

      <div>
        {resultats.length === 0 ? (
          <p>Aucun résultat.</p>
        ) : (
          resultats.map((alerte) => (
            <CarteAlerte key={alerte.id} alerte={alerte} />
          ))
        )}
      </div>
    </div>
  );
}

export default Accueil;
