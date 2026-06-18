import { Router } from 'express'

const router = Router()

router.get('/vapid-public-key', (req, res) => {
  res.json({ data: { publicKey: process.env.VAPID_PUBLIC_KEY } })
})

export default router