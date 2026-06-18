import { Router } from 'express'
import Subscription from '../db/Subscription.js'

const router = Router()

router.post('/subscribe', async (req, res) => {
  try {
    const { subscription, preferences } = req.body

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ error: 'Requête invalide', message: 'subscription manquante ou incomplète' })
    }

    const dejaAbonne = await Subscription.findOne({ endpoint: subscription.endpoint })
    if (dejaAbonne) {
      return res.status(200).json({ data: dejaAbonne })
    }

    const nouvelAbonnement = await Subscription.create({
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      preferences: preferences || {}
    })

    res.status(201).json({ data: nouvelAbonnement })
  } catch (erreur) {
    res.status(500).json({ error: 'Erreur serveur', message: erreur.message })
  }
})

router.post('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body

    if (!endpoint) {
      return res.status(400).json({ error: 'Requête invalide', message: 'endpoint manquant' })
    }

    const supprime = await Subscription.findOneAndDelete({ endpoint })

    if (!supprime) {
      return res.status(404).json({ error: 'Introuvable', message: 'Aucun abonnement avec cet endpoint' })
    }

    res.status(200).json({ data: { message: 'Désabonnement réussi' } })
  } catch (erreur) {
    res.status(500).json({ error: 'Erreur serveur', message: erreur.message })
  }
})

export default router