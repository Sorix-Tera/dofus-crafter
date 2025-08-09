
# Dofus Crafter (MVP)

Petit outil statique pour calculer le coût de craft, le profit et suivre des ventes d'objets Dofus.
Fonctionne 100% en local (GitHub Pages possible).

## Caractéristiques
- Recherche d'objets (API dofusdude, FR)
- Détail équipement + recette (quantités)
- Catalogue de prix *par ressource* (IndexedDB) avec auto-sauvegarde dès la saisie
- Calcul coût craft / prix de vente / profit / % marge
- Watchlist (liste de suivi) persistée
- Historique des ventes, avec 2 graphiques (coûts de craft et prix de vente dans le temps)
- Export/Import à ajouter (prochaines étapes)

## Lancer en local

1) Installer Node 18+
2) `npm install`
3) `npm run dev` puis ouvrir l'URL affichée.

## Déploiement GitHub Pages

- Crée le repo et pousse le code
- Active GitHub Pages (branch `gh-pages`)
- `npm run build` puis `npm run deploy` (publie `dist/` sur `gh-pages`)

## Notes
- Pour l'instant, le détail (recette) est implémenté pour les **équipements** (endpoint `/items/equipment/{ankama_id}`).
- Les prix des ressources sont stockés dans `IndexedDB` (table `ResourcePrices`). Chaque saisie écrase la précédente et met à jour la date.
- L'historique des ventes enregistre le coût de craft *au moment* de la vente pour conserver la traçabilité.
