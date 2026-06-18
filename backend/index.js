import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connecterDB } from './db/connect.js'
import avisAlertesRoutes from './routes/avisAlertes.js'
import vapidPublicKeyRoutes from './routes/vapidPublicKey.js'
import subscriptionRoutes from './routes/subscription.js'
import webpush from 'web-push'
import sendNotificationRoutes from './routes/sendNotification.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)
const originsAutorisees = ['http://localhost:5173', 'http://localhost:4173']
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || originsAutorisees.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Origine non autorisée par CORS'))
    }
  }
}))
app.use(express.json())

app.use(avisAlertesRoutes)
app.use(vapidPublicKeyRoutes)
app.use(subscriptionRoutes)
app.use(sendNotificationRoutes)
app.get('/', (req, res) => {
  res.send('Le serveur backend fonctionne')
})

connecterDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err.message)
  })