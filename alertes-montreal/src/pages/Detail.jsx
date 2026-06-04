import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAlerteById } from "../services/alertes";
import "./Detail.css";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alerte, setAlerte] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    getAlerteById(id)
      .then((data) => {
        setAlerte(data);
        setChargement(false);
      })
      .catch(() => {
        setErreur("Impossible de charger l'alerte.");
        setChargement(false);
      });
  }, [id]);

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p style={{ padding: "20px", color: "red" }}>{erreur}</p>;
  if (!alerte) return <p style={{ padding: "20px" }}>Alerte introuvable.</p>;

  return (
    <div className="detail">
      <button onClick={() => navigate("/")}>← Retour aux alertes</button>

      <h1>{alerte.titre}</h1>
      <p className="info">
        {alerte.arrondissement} — {alerte.sujet} — {alerte.dateEmission}
      </p>
      <hr />
      <p className="description">{alerte.description}</p>
    </div>
  );
}

export default Detail;
