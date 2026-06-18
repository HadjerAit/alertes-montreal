import { Router } from 'express'
import webpush from 'web-push'
import Subscription from '../db/Subscription.js'
import Notification from '../db/Notification.js'

const router = Router()

router.post('/send-notification', async (req, res) => {
  try {
    const { title, body, url, sujets, arrondissements } = req.body

    if (!title || !body) {
      return res.status(400).json({ error: 'Requête invalide', message: 'title et body sont requis' })
    }

    const filtre = {}
    if (sujets && sujets.length > 0) {
      filtre['preferences.sujets'] = { $in: sujets }
    }
    if (arrondissements && arrondissements.length > 0) {
      filtre['preferences.arrondissements'] = { $in: arrondissements }
    }

    const abonnements = await Subscription.find(filtre)
    const payload = JSON.stringify({ title, body, url: url || '/' })

    let successCount = 0
    let failureCount = 0

    for (const abonnement of abonnements) {
      const pushSubscription = {
        endpoint: abonnement.endpoint,
        keys: abonnement.keys
      }

      try {
        await webpush.sendNotification(pushSubscription, payload)
        successCount++
      } catch (erreurEnvoi) {
        failureCount++

        if (erreurEnvoi.statusCode === 410 || erreurEnvoi.statusCode === 404) {
          await Subscription.deleteOne({ endpoint: abonnement.endpoint })
        }
      }
    }

    await Notification.create({
      title,
      body,
      recipientsCount: abonnements.length,
      successCount,
      failureCount
    })

    res.status(200).json({
      data: { recipientsCount: abonnements.length, successCount, failureCount }
    })
  } catch (erreur) {
    res.status(500).json({ error: 'Erreur serveur', message: erreur.message })
  }
})

export default router