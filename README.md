# Projet 1 - Avis et alertes Montréal

## Étudiante

Ait Hadi Hadjer

## Comment lancer le projet

npm install
npm run dev

Ensuite ouvrir http://localhost:5173

## Ce que j'ai fait

-Page d'accueil avec liste des alertes
-Recherche par titre
-Filtres par arrondissement, date et sujet
-Page de détail quand on clique sur une alerte
-Fonctionne sur mobile

## Technologies utilisées

- **React avec Vite** : j'ai choisi Vite parce que c'est rapide à installer et facile à utiliser pour démarrer un projet React
- **react-router-dom** : j'en avais besoin pour faire la navigation entre la page d'accueil et la page de détail sans recharger la page
- **CSS vanilla** : j'ai utilisé des fichiers CSS séparés pour chaque composant pour garder le code organisé
- **src/services/alertes.js** : j'ai mis les données dans un fichier séparé pour que les composants n'aient pas à savoir d'où viennent les données, ce qui va faciliter la connexion à une vraie API au projet 2
