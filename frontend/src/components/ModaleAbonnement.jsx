import { useState, useEffect } from "react";
import { useAbonnementPush } from "../hooks/useAbonnementPush";
import "./ModaleAbonnement.css";

function ModaleAbonnement({ onFermer, arrondissements, sujets }) {
  const {
    estAbonne,
    pushDisponible,
    statutPermission,
    enCours,
    erreur,
    sAbonner,
    seDesabonner,
  } = useAbonnementPush();
  const [sujetsChoisis, setSujetsChoisis] = useState([]);
  const [arrondissementsChoisis, setArrondissementsChoisis] = useState([]);

  useEffect(() => {
    function gererEsc(e) {
      if (e.key === "Escape") onFermer();
    }
    window.addEventListener("keydown", gererEsc);
    return () => window.removeEventListener("keydown", gererEsc);
  }, [onFermer]);

  function toggleSujet(valeur) {
    setSujetsChoisis((prev) =>
      prev.includes(valeur)
        ? prev.filter((s) => s !== valeur)
        : [...prev, valeur],
    );
  }

  function toggleArrondissement(valeur) {
    setArrondissementsChoisis((prev) =>
      prev.includes(valeur)
        ? prev.filter((a) => a !== valeur)
        : [...prev, valeur],
    );
  }

  async function gererAbonnement() {
    await sAbonner({
      sujets: sujetsChoisis,
      arrondissements: arrondissementsChoisis,
    });
  }

  return (
    <div className="fond-modale" onClick={onFermer}>
      <div className="modale" onClick={(e) => e.stopPropagation()}>
        <button className="fermer" onClick={onFermer}>
          ✕
        </button>
        <h2>Notifications</h2>
        <p>
          Abonnez-vous pour recevoir une notification sur cet appareil dès qu'un
          nouvel avis correspondant à vos préférences est publié.
        </p>

        {!pushDisponible && (
          <p className="erreur">
            Les notifications push ne sont pas disponibles sur ce navigateur.
          </p>
        )}

        {pushDisponible && statutPermission === "denied" && !estAbonne && (
          <p className="erreur">
            La permission de notification est bloquée. Autorisez-la dans les
            réglages du navigateur pour vous abonner.
          </p>
        )}

        {pushDisponible && statutPermission !== "denied" && !estAbonne && (
          <>
            <p className="sous-titre">Sujets d'intérêt (optionnel)</p>
            <div className="choix">
              {sujets.map((s) => (
                <label key={s} className="choix-item">
                  <input
                    type="checkbox"
                    checked={sujetsChoisis.includes(s)}
                    onChange={() => toggleSujet(s)}
                  />
                  {s}
                </label>
              ))}
            </div>

            <p className="sous-titre">Arrondissements d'intérêt (optionnel)</p>
            <div className="choix">
              {arrondissements.map((a) => (
                <label key={a} className="choix-item">
                  <input
                    type="checkbox"
                    checked={arrondissementsChoisis.includes(a)}
                    onChange={() => toggleArrondissement(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </>
        )}

        {erreur && <p className="erreur">{erreur}</p>}

        <div className="actions">
          {estAbonne ? (
            <button onClick={seDesabonner} disabled={enCours}>
              {enCours ? "..." : "Se désabonner"}
            </button>
          ) : (
            pushDisponible &&
            statutPermission !== "denied" && (
              <button onClick={gererAbonnement} disabled={enCours}>
                {enCours ? "..." : "S'abonner"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ModaleAbonnement;
