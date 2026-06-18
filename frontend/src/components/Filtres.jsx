import "./Filtres.css";

function Filtres({
  arrondissements,
  sujets,
  filtreArrondissement,
  setFiltreArrondissement,
  filtreDebut,
  setFiltreDebut,
  filtreFin,
  setFiltreFin,
  filtreSujet,
  setFiltreSujet,
  reinitialiserFiltres,
}) {
  function toggleArrondissement(valeur) {
    if (filtreArrondissement.includes(valeur)) {
      setFiltreArrondissement(filtreArrondissement.filter((a) => a !== valeur));
    } else {
      setFiltreArrondissement([...filtreArrondissement, valeur]);
    }
  }

  function toggleSujet(valeur) {
    if (filtreSujet.includes(valeur)) {
      setFiltreSujet(filtreSujet.filter((s) => s !== valeur));
    } else {
      setFiltreSujet([...filtreSujet, valeur]);
    }
  }

  const tousLesFiltresActifs = [
    ...filtreArrondissement.map((a) => ({ type: "arrondissement", valeur: a })),
    ...filtreSujet.map((s) => ({ type: "sujet", valeur: s })),
  ];

  return (
    <div>
      <div className="filtres">
        <select onChange={(e) => toggleArrondissement(e.target.value)} value="">
          <option value="" disabled>
            Arrondissement
          </option>
          {arrondissements.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filtreDebut}
          onChange={(e) => setFiltreDebut(e.target.value)}
        />
        <input
          type="date"
          value={filtreFin}
          onChange={(e) => setFiltreFin(e.target.value)}
        />

        <select onChange={(e) => toggleSujet(e.target.value)} value="">
          <option value="" disabled>
            Sujet
          </option>
          {sujets.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button onClick={reinitialiserFiltres}>Tout effacer</button>
      </div>

      {tousLesFiltresActifs.length > 0 && (
        <div className="chips">
          {tousLesFiltresActifs.map((filtre) => (
            <span key={filtre.valeur} className="chip">
              {filtre.valeur}
              <button
                onClick={() =>
                  filtre.type === "arrondissement"
                    ? toggleArrondissement(filtre.valeur)
                    : toggleSujet(filtre.valeur)
                }
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Filtres;
