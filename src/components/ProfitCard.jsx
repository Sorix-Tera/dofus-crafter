
import React from 'react'

export default function ProfitCard({ craftCost, salePrice, onSalePrice }) {
  const cost = Number(craftCost || 0)
  const sale = Number(salePrice || 0)
  const profit = sale - cost
  const margin = cost > 0 ? (profit / cost) * 100 : 0

  return (
    <div className="grid">
      <div className="card">
        <div className="section-title">Coût de craft</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{cost.toLocaleString()} kamas</div>
      </div>
      <div className="card">
        <div className="section-title">Prix de vente</div>
        <input type="number" min="0" step="1" value={salePrice}
          onChange={e => onSalePrice(e.target.value)} />
        <div style={{ marginTop: 8 }} className="small">Entre ton prix de mise en vente</div>
      </div>
      <div className="card">
        <div className="section-title">Profit estimé</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: profit>=0 ? 'var(--accent2)' : 'var(--danger)'}}>
          {profit.toLocaleString()} kamas
        </div>
        <div className="small">{margin.toFixed(1)} %</div>
      </div>
    </div>
  )
}
