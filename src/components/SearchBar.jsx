
import React, { useEffect, useState } from 'react'
import { searchEquipment } from '../api/dofusdude'

export default function SearchBar({ onPick }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchEquipment(q, 12)
        setResults(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  return (
    <div className="card">
      <div className="section-title">Ajouter un objet</div>
      <input
        type="text"
        placeholder="Cherche un équipement… (ex. coiffe)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {loading && <div className="small">Recherche…</div>}
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {results?.map(it => (
          <button key={it.ankama_id} className="ghost"
            onClick={() => onPick(it)}>
            <div className="flex">
              {it.image_urls && <img className="item" src={it.image_urls?.thumb || it.image_urls?.hq} alt="" />}
              <div style={{textAlign:'left'}}>
                <div>{it.name}</div>
                <div className="small">Lvl {it.level} • {it.type?.name}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
