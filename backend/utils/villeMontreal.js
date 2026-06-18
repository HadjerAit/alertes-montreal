const RESOURCE_ID = 'fc6e5f85-7eba-451c-8243-bdf35c2ab336'
const URL_API = `https://donnees.montreal.ca/api/3/action/datastore_search?resource_id=${RESOURCE_ID}&limit=100`

function extraireArrondissement(titre, servicePublieur) {
  const match = titre.match(/arrondissement[s]?\s+(?:de\s+|d['’])?([^,.\-–]+)/i)
  if (match) return match[1].trim()
  return servicePublieur || 'Non spécifié'
}

function normaliser(alerte) {
  return {
    id: alerte._id.toString(),
    titre: alerte.titre || 'Sans titre',
    arrondissement: extraireArrondissement(alerte.titre, alerte.service_publieur),
    sujet: alerte.type || 'Autre',
    dateEmission: alerte.date_debut ? alerte.date_debut.split('T')[0] : '',
    heure: alerte.date_debut ? alerte.date_debut.split('T')[1]?.slice(0, 5) : '',
    resume: alerte.titre || '',
    description: alerte.titre || '',
    lien: alerte.lien || ''
  }
}

export async function obtenirAvisAlertes() {
  const reponse = await fetch(URL_API)
  if (!reponse.ok) {
    throw new Error('Erreur lors de la récupération des données de la Ville de Montréal')
  }
  const donnees = await reponse.json()
  return donnees.result.records.map(normaliser)
}