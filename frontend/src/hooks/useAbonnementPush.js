import { useState, useEffect } from 'react'
import { getCleVapid, envoyerAbonnement, supprimerAbonnement } from '../services/abonnement'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function useAbonnementPush() {
  const [estAbonne, setEstAbonne] = useState(false)
  const [pushDisponible, setPushDisponible] = useState(true)
  const [statutPermission, setStatutPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushDisponible(false)
      return
    }
    navigator.serviceWorker.ready.then(async (registration) => {
      const subscription = await registration.pushManager.getSubscription()
      setEstAbonne(!!subscription)
    })
  }, [])

  async function sAbonner(preferences) {
    setErreur(null)
    if (!pushDisponible) {
      setErreur('Les notifications push ne sont pas disponibles sur ce navigateur.')
      return
    }
    if (Notification.permission === 'denied') {
      setStatutPermission('denied')
      setErreur('La permission de notification est bloquée dans les réglages du navigateur.')
      return
    }
    setEnCours(true)
    try {
      const permission = await Notification.requestPermission()
      setStatutPermission(permission)
      if (permission !== 'granted') {
        setErreur('Permission refusée.')
        return
      }
      const registration = await navigator.serviceWorker.ready
      const cleVapid = await getCleVapid()

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(cleVapid)
      })
      await envoyerAbonnement(subscription.toJSON(), preferences)
      setEstAbonne(true)
    } catch (e) {

      setErreur("Erreur lors de l'abonnement.")
    } finally {
      setEnCours(false)
    }
  }

  async function seDesabonner() {
    setErreur(null)
    setEnCours(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await supprimerAbonnement(subscription.endpoint)
        await subscription.unsubscribe()
      }
      setEstAbonne(false)
    } catch (e) {
      setErreur('Erreur lors du désabonnement.')
    } finally {
      setEnCours(false)
    }
  }

  return { estAbonne, pushDisponible, statutPermission, enCours, erreur, sAbonner, seDesabonner }
}