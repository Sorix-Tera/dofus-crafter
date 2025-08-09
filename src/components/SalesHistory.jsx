
import React, { useEffect, useRef, useState } from 'react'
import { addSale, getAllSales, getSalesByItem } from '../db/priceService'
import Chart from 'chart.js/auto'

export default function SalesHistory({ item }) {
  const [sales, setSales] = useState([])
  const canvasBuy = useRef(null)
  const canvasSell = useRef(null)
  const [price, setPrice] = useState(item?.salePrice || 0)
  const [days, setDays] = useState(1)

  async function load() {
    if (!item) {
      setSales(await getAllSales())
    } else {
      setSales(await getSalesByItem(item.ankama_id))
    }
  }

  useEffect(() => { load() }, [item])

  useEffect(() => {
    let chart1, chart2
    const buys = sales.map(s => ({ x: new Date(s.date), y: s.purchaseCost }))
    const sells = sales.map(s => ({ x: new Date(s.date), y: s.salePrice }))
    if (canvasBuy.current) {
      chart1 = new Chart(canvasBuy.current, {
        type: 'line',
        data: { datasets: [{ label: 'Coût craft', data: buys }]},
        options: { scales: { x: { type: 'time', time: { unit: 'day' } } } }
      })
    }
    if (canvasSell.current) {
      chart2 = new Chart(canvasSell.current, {
        type: 'line',
        data: { datasets: [{ label: 'Prix de vente', data: sells }]},
        options: { scales: { x: { type: 'time', time: { unit: 'day' } } } }
      })
    }
    return () => { chart1?.destroy(); chart2?.destroy(); }
  }, [sales])

  const add = async () => {
    const entry = {
      itemId: item.ankama_id,
      date: new Date().toISOString(),
      purchaseCost: Number(item.craftCost || 0),
      salePrice: Number(price || 0),
      daysToSell: Number(days || 0),
    }
    await addSale(entry)
    await load()
  }

  if (!item) return null

  return (
    <div className="card">
      <div className="section-title">Historique des ventes — {item?.name}</div>
      <div className="grid">
        <div>
          <div className="small">Graph prix d'achat</div>
          <canvas ref={canvasBuy} height="140"></canvas>
        </div>
        <div>
          <div className="small">Graph prix de vente</div>
          <canvas ref={canvasSell} height="140"></canvas>
        </div>
      </div>
      <hr className="sep" />
      <div className="grid">
        <div className="card">
          <div className="section-title">Ajouter une vente</div>
          <div className="grid">
            <div>
              <div className="small">Prix de vente</div>
              <input type="number" value={price} onChange={e=>setPrice(e.target.value)} />
            </div>
            <div>
              <div className="small">Jours pour vendre</div>
              <input type="number" value={days} onChange={e=>setDays(e.target.value)} />
            </div>
            <div style={{alignSelf:'end'}}>
              <button onClick={add}>Ajouter</button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="section-title">Dernières ventes</div>
          <table className="table">
            <thead><tr><th>Date</th><th className="right">Achat</th><th className="right">Vente</th><th className="right">Jours</th></tr></thead>
            <tbody>
              {sales.slice().reverse().map((s,i)=>(
                <tr key={i}>
                  <td>{new Date(s.date).toLocaleDateString()}</td>
                  <td className="right">{s.purchaseCost.toLocaleString()}</td>
                  <td className="right">{s.salePrice.toLocaleString()}</td>
                  <td className="right">{s.daysToSell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
