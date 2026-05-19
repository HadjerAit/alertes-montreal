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
  return (
    <div className="filtres">
      <select
        value={filtreArrondissement}
        onChange={(e) => setFiltreArrondissement(e.target.value)}
      >
        <option value="">Arrondissement</option>
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

      <select
        value={filtreSujet}
        onChange={(e) => setFiltreSujet(e.target.value)}
      >
        <option value="">Sujet</option>
        {sujets.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button onClick={reinitialiserFiltres}>Réinitialiser</button>
    </div>
  );
}

export default Filtres;
