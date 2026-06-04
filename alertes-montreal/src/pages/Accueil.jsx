import { useState, useEffect } from "react";
import { getAlertes } from "../services/alertes";
import BarreRecherche from "../components/BarreRecherche";
import Filtres from "../components/Filtres";
import CarteAlerte from "../components/CarteAlerte";
import "./Accueil.css";

const PAR_PAGE = 10;

function Accueil() {
  const [alertes, setAlertes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [horsLigne, setHorsLigne] = useState(!navigator.onLine);

  const [recherche, setRecherche] = useState("");
  const [filtreArrondissement, setFiltreArrondissement] = useState([]);
  const [filtreSujet, setFiltreSujet] = useState([]);
  const [filtreDebut, setFiltreDebut] = useState("");
  const [filtreFin, setFiltreFin] = useState("");
  const [nbVisibles, setNbVisibles] = useState(PAR_PAGE);

  useEffect(() => {
    getAlertes()
      .then((data) => {
        setAlertes(data);
        setChargement(false);
      })
      .catch(() => {
        setErreur("Impossible de charger les alertes.");
        setChargement(false);
      });

    function gererEnLigne() { setHorsLigne(false); }
    function gererHorsLigne() { setHorsLigne(true); }
    window.addEventListener("online", gererEnLigne);
    window.addEventListener("offline", gererHorsLigne);
    return () => {
      window.removeEventListener("online", gererEnLigne);
      window.removeEventListener("offline", gererHorsLigne);
    };
  }, []);

  const listeArr = [...new Set(alertes.map((a) => a.arrondissement))].sort();
  const listeSujets = [...new Set(alertes.map((a) => a.sujet))].sort();

  function enleverAccents(str) {
    return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  const resultats = alertes.filter((alerte) => {
    const okRecherche = enleverAccents(alerte.titre.toLowerCase()).includes(
      enleverAccents(recherche.toLowerCase())
    );
    const okArr =
      filtreArrondissement.length === 0 ||
      filtreArrondissement.includes(alerte.arrondissement);
    const okSujet =
      filtreSujet.length === 0 || filtreSujet.includes(alerte.sujet);
    const okDebut = filtreDebut === "" || alerte.dateEmission >= filtreDebut;
    const okFin = filtreFin === "" || alerte.dateEmission <= filtreFin;
    return okRecherche && okArr && okSujet && okDebut && okFin;
  });

  function resetFiltres() {
    setRecherche("");
    setFiltreArrondissement([]);
    setFiltreSujet([]);
    setFiltreDebut("");
    setFiltreFin("");
    setNbVisibles(PAR_PAGE);
  }

  if (chargement) return <p className="message-chargement">Chargement...</p>;
  if (erreur) return <p style={{ padding: "20px", color: "red" }}>{erreur}</p>;

  const alertesVisibles = resultats.slice(0, nbVisibles);

  return (
    <div>
      {horsLigne && (
        <div className="banniere-hors-ligne">
          Vous êtes hors-ligne — les données affichées peuvent ne pas être à jour.
        </div>
      )}

      <div className="hero">
        <h1>Avis et alertes</h1>
        <p>Trouver un avis</p>
        <BarreRecherche recherche={recherche} setRecherche={setRecherche} />
      </div>

      <div className="accueil">
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

        {resultats.length === 0 ? (
          <p>Aucun résultat.</p>
        ) : (
          <>
            {alertesVisibles.map((alerte) => (
              <CarteAlerte key={alerte.id} alerte={alerte} />
            ))}
            {nbVisibles < resultats.length && (
              <button
                className="charger-plus"
                onClick={() => setNbVisibles(nbVisibles + PAR_PAGE)}
              >
                Charger plus
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Accueil;
