
# Dofus Crafter (MVP corrigé)

- Recherche équipements avec images (endpoint `/items/equipment/search`)
- Détail + recette robuste (tolère plusieurs formes d'objets ingrédient)
- Catalogue de prix auto-sauvé (IndexedDB)
- Coût craft / Prix / Profit / %
- Watchlist + Historique ventes + Graphs

## Lancer
npm install
npm run dev

## Déployer (GitHub Pages)
1) Dans `vite.config.js`, remplace `base: ''` par `/NOM_DU_REPO/`
2) npm run build
3) npm run deploy
