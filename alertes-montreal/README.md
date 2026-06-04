# Projet 2 - Avis et alertes Montréal (PWA)

## Étudiante

Ait Hadi Hadjer

## Comment lancer le projet

```
npm install
npm run dev
```

Ouvrir http://localhost:5173

Pour tester la version production (PWA complète) :

```
npm run build
npm run preview
```

# Fonctionnalités réalisées

- Connexion à l’API de la Ville de Montréal
- Gestion du chargement et des erreurs
- Filtres multi‑sélection (arrondissement et sujet)
- Affichage des filtres actifs (chips)
- Filtre par dates
- Bouton “Charger plus”
- Message hors‑ligne
- Application installable (manifest + service worker)

## Technologies utilisées

- React avec Vite : même choix que projet 1, rapide et simple
- vite-plugin-pwa (Workbox) : pour générer le service worker et le manifest automatiquement
- react-router-dom: navigation entre accueil et page de détail
- CSS vanilla : CSS séparé par composant
- src/services/alertes.js : module de mapping entre les données brutes de l'API et le modèle interne de l'app

## \*\*Cache (PWA)

J'ai utilisé deux stratégies différentes selon le type de ressource :

- Assets statiques (JS, CSS, images, polices): précachés avec Workbox au premier chargement. Ils ne changent pas souvent donc on peut les garder en cache longtemps.

- Données de l'API Ville de Montréal :stratégie StaleWhileRevalidate. L'app affiche d'abord les données en cache (rapide), et en même temps fait une requête en arrière-plan pour mettre le cache à jour.
- En mode hors-ligne, les dernières alertes téléchargées restent visibles et une bannière avertit l'utilisateur.

## Scores Lighthouse (production)

- Performance : 97
- PWA : 76
- Best Practices : 100
- SEO : 83
