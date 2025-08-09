
import React, { useEffect, useState } from 'react'
import { getWatchlist, removeFromWatchlist, saveToWatchlist } from '../db/priceService'

export default function Watchlist({ onSelect }) {
  const [items, setItems] = useState([])

  async function load() { setItems(await getWatchlist()) }
  useEffect(() => { load() }, [])

  const remove = async (id) => { await removeFromWatchlist(id); await load() }
  const toggleSold = async (it) => { await saveToWatchlist({ ...it, sold: !it.sold }); await load() }

  return (
    <div className="card">
      <div className="section-title">Watchlist</div>
      <table className="table">
        <thead>
          <tr>
            <th></th><th>Item</th><th className="right">Lvl</th><th className="right">Coût craft</th><th className="right">Prix vente</th><th className="right">Profit</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => {
            const profit = Number(it.salePrice || 0) - Number(it.craftCost || 0)
            return (
              <tr key={it.ankama_id}>
                <td>{it.imageUrl && <img className="item" src={it.imageUrl} />}</td>
                <td><button className="ghost" onClick={() => onSelect(it)}>{it.name}</button></td>
                <td className="right">{it.level}</td>
                <td className="right">{Number(it.craftCost||0).toLocaleString()}</td>
                <td className="right">{Number(it.salePrice||0).toLocaleString()}</td>
                <td className="right" style={{color: profit>=0 ? 'var(--accent2)' : 'var(--danger)'}}>{profit.toLocaleString()}</td>
                <td>
                  <button className="ghost" onClick={() => toggleSold(it)}>{it.sold ? 'Vendu' : 'Suivi'}</button>
                  <button className="ghost" onClick={() => remove(it.ankama_id)}>Suppr</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
