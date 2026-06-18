import { Router } from 'express'
import { obtenirAvisAlertes } from '../utils/villeMontreal.js'

const router = Router()

router.get('/avis-alertes', async (req, res) => {
  try {
    let avis = await obtenirAvisAlertes()

    const { sujet, arrondissement, q, limit, offset } = req.query

    if (sujet) {
      avis = avis.filter(a => a.sujet.toLowerCase() === sujet.toLowerCase())
    }

    if (arrondissement) {
      avis = avis.filter(a => a.arrondissement.toLowerCase() === arrondissement.toLowerCase())
    }

    if (q) {
      const recherche = q.toLowerCase()
      avis = avis.filter(a => a.titre.toLowerCase().includes(recherche))
    }

    const debut = offset ? parseInt(offset, 10) : 0
    const fin = limit ? debut + parseInt(limit, 10) : avis.length
    avis = avis.slice(debut, fin)

    res.json({ data: avis })
  } catch (erreur) {
    res.status(500).json({ error: 'Erreur serveur', message: erreur.message })
  }
})

export default router