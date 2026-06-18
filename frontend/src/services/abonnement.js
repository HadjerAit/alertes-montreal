const URL_API = 'http://localhost:3001'

export async function getCleVapid() {
  const reponse = await fetch(`${URL_API}/vapid-public-key`)
  if (!reponse.ok) throw new Error('Impossible de récupérer la clé VAPID')
  const resultat = await reponse.json()
  return resultat.data.publicKey
}

export async function envoyerAbonnement(subscription, preferences) {
  const reponse = await fetch(`${URL_API}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription, preferences })
  })
  if (!reponse.ok) throw new Error("Erreur lors de l'abonnement")
  return reponse.json()
}

export async function supprimerAbonnement(endpoint) {
  const reponse = await fetch(`${URL_API}/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint })
  })
  if (!reponse.ok && reponse.status !== 404) throw new Error('Erreur lors du désabonnement')
  return reponse.json()
}