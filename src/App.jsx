
import React, { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import RecipeTable from './components/RecipeTable.jsx'
import ProfitCard from './components/ProfitCard.jsx'
import Watchlist from './components/Watchlist.jsx'
import SalesHistory from './components/SalesHistory.jsx'
import { getEquipment } from './api/dofusdude.js'
import { saveToWatchlist } from './db/priceService.js'

export default function App() {
  const [picked, setPicked] = useState(null)
  const [itemDetail, setItemDetail] = useState(null)
  const [craftCost, setCraftCost] = useState(0)
  const [salePrice, setSalePrice] = useState('')

  async function pickItem(it) {
    setPicked(it)
    setItemDetail(null)
    try {
      const detail = await getEquipment(it.ankama_id)
      setItemDetail(detail)
    } catch (e) {
      console.error(e)
      alert('Impossible de charger le détail de l'objet (seul equipment supporté dans ce MVP).')
    }
  }

  const saveWatch = async () => {
    if (!picked) return
    const w = {
      ankama_id: picked.ankama_id,
      name: picked.name,
      level: picked.level,
      imageUrl: picked.image_urls?.thumb || picked.image_urls?.hq,
      craftCost: Number(craftCost || 0),
      salePrice: Number(salePrice || 0),
      sold: false
    }
    await saveToWatchlist(w)
    alert('Ajouté à la watchlist.')
  }

  return (
    <div className="container">
      <div className="header">
        <h1 style={{margin:0}}>Dofus Crafter</h1>
        <span className="badge">MVP</span>
      </div>

      <div className="grid">
        <SearchBar onPick={pickItem} />
        <Watchlist onSelect={pickItem} />
      </div>

      {picked && itemDetail && (
        <div className="card" style={{marginTop:16}}>
          <div className="flex" style={{justifyContent:'space-between'}}>
            <div className="flex">
              {picked.image_urls?.thumb && <img className="item" src={picked.image_urls.thumb} />}
              <div>
                <div style={{fontSize:18, fontWeight:700}}>{picked.name}</div>
                <div className="small">Lvl {picked.level} • {picked.type?.name}</div>
              </div>
            </div>
            <div>
              <button className="secondary" onClick={saveWatch}>Ajouter à la watchlist</button>
            </div>
          </div>

          <hr className="sep" />

          <ProfitCard craftCost={craftCost} salePrice={salePrice} onSalePrice={setSalePrice} />

          <hr className="sep" />

          <div className="section-title">Recette</div>
          {itemDetail.recipe && itemDetail.recipe.length > 0 ? (
            <RecipeTable recipe={itemDetail.recipe} onTotalsChange={({craftCost}) => setCraftCost(craftCost)} />
          ) : (
            <div className="small">Pas de recette trouvée pour cet item (ou non supporté dans ce MVP).</div>
          )}

          <SalesHistory item={{...picked, craftCost, salePrice}} />
        </div>
      )}

      {!picked && (
        <div className="card" style={{marginTop:16}}>
          <div className="small">Choisis un objet pour afficher sa recette et calculer le profit.</div>
        </div>
      )}
    </div>
  )
}
