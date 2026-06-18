import { useState, useEffect } from "react";
import { getAlertes } from "../services/alertes";
import BarreRecherche from "../components/BarreRecherche";
import Filtres from "../components/Filtres";
import CarteAlerte from "../components/CarteAlerte";
import "./Accueil.css";
import ModaleAbonnement from "../components/ModaleAbonnement";
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
  const [pageActuelle, setPageActuelle] = useState(1);
  const [modaleOuverte, setModaleOuverte] = useState(false);
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

    function gererEnLigne() {
      setHorsLigne(false);
    }
    function gererHorsLigne() {
      setHorsLigne(true);
    }
    window.addEventListener("online", gererEnLigne);
    window.addEventListener("offline", gererHorsLigne);
    return () => {
      window.removeEventListener("online", gererEnLigne);
      window.removeEventListener("offline", gererHorsLigne);
    };
  }, []);

  // remet à la page 1 quand un filtre ou la recherche change
  useEffect(() => {
    setPageActuelle(1);
  }, [recherche, filtreArrondissement, filtreSujet, filtreDebut, filtreFin]);

  const listeArr = [...new Set(alertes.map((a) => a.arrondissement))].sort();
  const listeSujets = [...new Set(alertes.map((a) => a.sujet))].sort();

  function enleverAccents(str) {
    return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  const resultats = alertes.filter((alerte) => {
    const okRecherche = enleverAccents(alerte.titre.toLowerCase()).includes(
      enleverAccents(recherche.toLowerCase()),
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
  }

  if (chargement) return <p className="message-chargement">Chargement...</p>;
  if (erreur) return <p style={{ padding: "20px", color: "red" }}>{erreur}</p>;

  const nombreDePages = Math.ceil(resultats.length / PAR_PAGE) || 1;
  const debut = (pageActuelle - 1) * PAR_PAGE;
  const alertesVisibles = resultats.slice(debut, debut + PAR_PAGE);

  return (
    <div>
      {horsLigne && (
        <div className="banniere-hors-ligne">
          Vous êtes hors-ligne — les données affichées peuvent ne pas être à
          jour.
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
          <button className="abonner" onClick={() => setModaleOuverte(true)}>
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

            <div className="pagination">
              <button
                disabled={pageActuelle === 1}
                onClick={() => setPageActuelle(pageActuelle - 1)}
              >
                ←
              </button>

              {Array.from({ length: nombreDePages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={page === pageActuelle ? "page-active" : ""}
                    onClick={() => setPageActuelle(page)}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                disabled={pageActuelle === nombreDePages}
                onClick={() => setPageActuelle(pageActuelle + 1)}
              >
                →
              </button>
            </div>
          </>
        )}
      </div>
      {modaleOuverte && (
        <ModaleAbonnement
          onFermer={() => setModaleOuverte(false)}
          arrondissements={listeArr}
          sujets={listeSujets}
        />
      )}
    </div>
  );
}

export default Accueil;
