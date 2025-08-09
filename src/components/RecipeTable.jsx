
import React, { useEffect, useState } from 'react'
import { getPrice, setPrice } from '../db/priceService'
import { resolveItemById } from '../api/dofusdude'

export default function RecipeTable({ recipe, onTotalsChange }) {
  const [rows, setRows] = useState([])

  
useEffect(() => {
  async function hydrate() {
    const base = (recipe || []).map(ing => {
      const item = ing.item || ing.ingredient || ing
      const id = item?.ankama_id ?? ing?.item_ankama_id ?? ing?.ankama_id ?? ing?.id
      return { raw: ing, item, id, quantity: ing.quantity || ing.qty || 0 }
    })

    // Resolve missing items (name/images) if needed
    const resolved = await Promise.all(base.map(async b => {
      let item = b.item
      if (!item?.name && b.id) {
        item = await resolveItemById(b.id) || item
      }
      const p = b.id ? await getPrice(b.id) : null
      return {
        ...b.raw,
        item,
        id: b.id,
        name: item?.name || '???',
        img: item?.image_urls?.thumb || item?.image_urls?.hq || null,
        quantity: b.quantity,
        lastUnitPrice: p?.lastUnitPrice ?? '',
        lastUpdatedAt: p?.lastUpdatedAt || null
      }
    }))

    setRows(resolved)
  }
  hydrate()
}, [recipe])
useEffect(() => {
    const craftCost = rows.reduce((sum, r) => {
      const u = Number(r.lastUnitPrice || 0)
      return sum + (u * (r.quantity || 0))
    }, 0)
    onTotalsChange?.({ craftCost })
  }, [rows])

  const handlePriceChange = (idx, val) => {
    setRows(r => r.map((row, i) => i === idx ? { ...row, lastUnitPrice: val } : row))
  }

  const handleBlur = async (idx) => {
    const r = rows[idx]
    if (!r?.id || r.lastUnitPrice === '' || isNaN(Number(r.lastUnitPrice))) return
    await setPrice({ ankama_id: r.id, name: r.name, lastUnitPrice: Number(r.lastUnitPrice) })
    setRows(rs => rs.map((row, i) => i === idx ? { ...row, lastUpdatedAt: new Date().toISOString() } : row))
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th></th>
          <th>Ingrédient</th>
          <th className="right">Qté</th>
          <th className="right">Prix unitaire</th>
          <th className="right">Sous-total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => {
          const subtotal = Number(r.lastUnitPrice || 0) * (r.quantity || 0)
          const badge = r.lastUpdatedAt ? <span className="badge ok">catalogue</span> : <span className="badge warn">à saisir</span>
          return (
            <tr key={r.id ?? (r.name + '-' + idx)}>
              <td>{r.img && <img className="item" src={r.img} />}</td>
              <td>{r.name}</td>
              <td className="right">{r.quantity || 0}</td>
              <td className="right">
                <input type="number" min="0" step="1"
                  value={r.lastUnitPrice}
                  onChange={e => handlePriceChange(idx, e.target.value)}
                  onBlur={() => handleBlur(idx)} />
              </td>
              <td className="right">{subtotal.toLocaleString()}</td>
              <td>{badge}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
