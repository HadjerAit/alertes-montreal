import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const titre = data.title || 'Avis et alertes Montréal'
  const options = {
    body: data.body || '',
    data: { url: data.url || '/' }
  }

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(titre, options),
      self.clients.matchAll({ type: 'window' }).then((clientsArr) => {
        clientsArr.forEach((client) =>
          client.postMessage({
            type: 'NOUVELLE_NOTIFICATION',
            title: titre,
            body: options.body,
            url: options.data.url
          })
        )
      })
    ])
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clientsArr) => {
      const clientOuvert = clientsArr.find((c) => c.url.includes(self.location.origin))
      if (clientOuvert) {
        if ('navigate' in clientOuvert) {
          await clientOuvert.navigate(url)
        }
        return clientOuvert.focus()
      }
      return self.clients.openWindow(url)
    })
  )
})