Projet 3 - Avis et alertes Montréal (notifications push)

Étudiante

Ait Hadi Hadjer

- Description

Suite du projet 2 : je garde la même appli (liste des avis et alertes de Montréal, filtres, pagination, PWA installable) et j'ajoute un backend en Express + MongoDB pour gérer les abonnements aux notifications push. Quand une nouvelle alerte est envoyée, les utilisateurs abonnés reçoivent un push directement dans leur navigateur.

- Fonctionnalités réalisées

-Tout ce qui était déjà fait dans le projet 2 (filtres, mode hors-ligne, PWA installable)
-Bonus : pagination numérotée (remplace le bouton "Charger plus" du projet 2)
-Abonnement aux notifications push depuis le navigateur (demande de permission)
-Gestion des 3 cas limites de l'abonnement : permission refusée, permission bloquée par le navigateur, API Push non disponible
-Backend Express qui stocke les abonnements dans MongoDB
-Envoi de notifications aux abonnés avec web-push
-Bonus : choix des préférences (sujet et arrondissement) à l'abonnement, pour filtrer qui reçoit quoi
-Bonus : journalisation des notifications envoyées dans la base

- Variables d'environnement requises

Le frontend n'a pas de fichier .env, l'URL du backend est écrite en dur dans src/services/alertes.js.

Dans backend/.env (voir backend/.env.example) il faut :

PORT
FRONTEND_ORIGIN
MONGODB_URI
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT

- Installation et démarrage

- Base de données

J'utilise MongoDB Atlas (plan gratuit). Créer un cluster sur mongodb.com/cloud/atlas, puis récupérer l'URI de connexion et le mettre dans le .env du backend.

- Backend

cd backend
npm install

-Créer un fichier .env à partir de .env.example et remplir les valeurs (URI MongoDB, clés VAPID, etc.)
-Générer les clés VAPID :

npx web-push generate-vapid-keys

- Démarrer le serveur :

npm run dev

Le serveur tourne sur http://localhost:3001 (ou le port choisi dans .env).

- Frontend

cd frontend
npm install
npm run dev

Ouvrir http://localhost:5173

Pour tester la vraie version PWA (production) :

npm run build
npm run preview

- Procédure pour tester l'envoi d'une notification

Test de base

-Lancer le backend et le frontend (npm run dev dans les deux dossiers)
-Aller sur http://localhost:5173, cliquer sur "M'abonner →", choisir des préférences puis cliquer "Autoriser" dans la fenêtre de permission du navigateur
-Envoyer une notification de test depuis un terminal :

curl -X POST http://localhost:3001/send-notification \
 -H "Content-Type: application/json" \
 -d '{"title":"Test","body":"Ceci est un test","url":"/alertes/LID_DE_LALERTE"}'

-La notification doit apparaître sur l'ordinateur. Cliquer dessus ouvre ou ramène l'application.

- Test des 3 cas limites de la modale d'abonnement

Les 3 cas sont indépendants, il faut réinitialiser la permission entre chaque test (chrome://settings/content/notifications).

- Cas 1 : permission refusée

-Supprimer l'entrée localhost:5173 dans chrome://settings/content/notifications (ça remet sur "default")
-Recharger la page
-Cliquer "S'abonner", puis dans le popup natif cliquer "Bloquer"
-La modale affiche "Autorisation refusée."

- Cas 2 : permission déjà bloquée

-Mettre localhost:5173 directement sur "Bloqué" dans les réglages
-Recharger la page
-Cliquer "S'abonner" (aucun popup n'apparaît cette fois)
-La modale affiche "La permission de notification est bloquée..."

- Cas 3 : API Push indisponible

-Remettre la permission sur Autoriser, recharger la page
-Dans la console DevTools, taper delete window.PushManager puis Entrée (ça doit retourner true)
-Sans recharger, ouvrir la modale d'abonnement
-Elle affiche "Les notifications push ne sont pas disponibles sur ce navigateur."

Le cas 3 est juste une simulation : Chrome gère Push normalement, je désactive l'API à la main pour montrer que mon code gère bien l'erreur quand même.

- Test du filtrage par préférences (bonus)

- Créer un faux abonnement avec un sujet :

curl -X POST http://localhost:3001/subscribe \
 -H "Content-Type: application/json" \
 -d '{"subscription":{"endpoint":"https://fake.endpoint/test1","keys":{"p256dh":"fakekey1","auth":"fakeauth1"}},"preferences":{"sujets":["Circulation et transport"],"arrondissements":["Ville-Marie"]}}'

- Créer un deuxième faux abonnement avec un sujet différent :

curl -X POST http://localhost:3001/subscribe \
 -H "Content-Type: application/json" \
 -d '{"subscription":{"endpoint":"https://fake.endpoint/test2","keys":{"p256dh":"fakekey2","auth":"fakeauth2"}},"preferences":{"sujets":["Eau et aqueduc"],"arrondissements":["Outremont"]}}'

- Envoyer une notification filtrée sur "Circulation et transport" : recipientsCount doit être 1.

curl -X POST http://localhost:3001/send-notification \
 -H "Content-Type: application/json" \
 -d '{"title":"Test filtrage","body":"Ne doit aller qu a abonnement 1","sujets":["Circulation et transport"]}'

- Envoyer sans filtre : recipientsCount doit inclure tout le monde.

curl -X POST http://localhost:3001/send-notification \
 -H "Content-Type: application/json" \
 -d '{"title":"Test broadcast","body":"Doit aller a tous"}'

- Nettoyer les faux abonnements :

curl -X POST http://localhost:3001/unsubscribe -H "Content-Type: application/json" -d '{"endpoint":"https://fake.endpoint/test1"}'
curl -X POST http://localhost:3001/unsubscribe -H "Content-Type: application/json" -d '{"endpoint":"https://fake.endpoint/test2"}'

- Déploiement

Pas encore déployé, testé seulement en local.
