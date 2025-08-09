
import React, { useEffect, useState } from 'react'
import { getPrice, setPrice } from '../db/priceService'

export default function RecipeTable({ recipe, onTotalsChange }) {
  const [rows, setRows] = useState([])

  useEffect(() => {
    async function hydrate() {
      const withPrices = await Promise.all((recipe || []).map(async ing => {
        const item = ing.item || ing.ingredient || ing
        const id = item?.ankama_id ?? ing?.ankama_id
        const p = id ? await getPrice(id) : null
        return {
          ...ing,
          item,
          name: item?.name || '???',
          img: item?.image_urls?.thumb || item?.image_urls?.hq || null,
          lastUnitPrice: p?.lastUnitPrice ?? '',
          lastUpdatedAt: p?.lastUpdatedAt || null,
          id
        }
      }))
      setRows(withPrices)
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
