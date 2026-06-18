const URL_API = 'http://localhost:3001/avis-alertes'

export async function getAlertes() {
  const reponse = await fetch(URL_API)
  if (!reponse.ok) throw new Error('Erreur API')
  const resultat = await reponse.json()
  return resultat.data
}

export async function getAlerteById(id) {
  const alertes = await getAlertes()
  return alertes.find(a => a.id === id)
}