
import React, { useEffect, useMemo, useState } from 'react'
import { getPrice, setPrice } from '../db/priceService'

export default function RecipeTable({ recipe, onTotalsChange }) {
  const [rows, setRows] = useState([])

  useEffect(() => {
    async function hydrate() {
      const withPrices = await Promise.all((recipe || []).map(async ing => {
        const p = await getPrice(ing.item.ankama_id)
        return {
          ...ing,
          name: ing.item.name,
          img: ing.item.image_urls?.thumb || null,
          lastUnitPrice: p?.lastUnitPrice ?? '',
          lastUpdatedAt: p?.lastUpdatedAt || null
        }
      }))
      setRows(withPrices)
    }
    hydrate()
  }, [recipe])

  useEffect(() => {
    const craftCost = rows.reduce((sum, r) => {
      const u = Number(r.lastUnitPrice || 0)
      return sum + (u * r.quantity)
    }, 0)
    onTotalsChange?.({ craftCost })
  }, [rows])

  const handlePriceChange = (idx, val) => {
    setRows(r => r.map((row, i) => i === idx ? { ...row, lastUnitPrice: val } : row))
  }

  const handleBlur = async (idx) => {
    const r = rows[idx]
    if (r.lastUnitPrice === '' || isNaN(Number(r.lastUnitPrice))) return
    await setPrice({ ankama_id: r.item.ankama_id, name: r.name, lastUnitPrice: Number(r.lastUnitPrice) })
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
          const subtotal = Number(r.lastUnitPrice || 0) * r.quantity
          const ageBadge = r.lastUpdatedAt ? <span className="badge ok">catalogue</span> : <span className="badge warn">à saisir</span>
          return (
            <tr key={r.item.ankama_id}>
              <td>{r.img && <img className="item" src={r.img} />}</td>
              <td>{r.name}</td>
              <td className="right">{r.quantity}</td>
              <td className="right">
                <input type="number" min="0" step="1"
                  value={r.lastUnitPrice}
                  onChange={e => handlePriceChange(idx, e.target.value)}
                  onBlur={() => handleBlur(idx)} />
              </td>
              <td className="right">{subtotal.toLocaleString()}</td>
              <td>{ageBadge}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
