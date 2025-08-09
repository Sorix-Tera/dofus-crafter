
const BASE = 'https://api.dofusdu.de/dofus3/v1/fr'

export async function searchEquipment(query, limit = 20) {
  const url = new URL(`${BASE}/items/equipment/search`)
  url.searchParams.set('query', query || '*')
  url.searchParams.set('limit', String(limit))
  const r = await fetch(url)
  if (!r.ok) throw new Error('API equipment search error')
  return r.json()
}

export async function getEquipment(ankamaId) {
  const r = await fetch(`${BASE}/items/equipment/${ankamaId}`)
  if (!r.ok) throw new Error('API item error')
  return r.json()
}

export async function getResource(ankamaId) {
  const r = await fetch(`${BASE}/items/resources/${ankamaId}`)
  if (!r.ok) throw new Error('API resource error')
  return r.json()
}


const _cache = new Map()

export async function resolveItemById(ankamaId) {
  if (!ankamaId) return null
  if (_cache.has(ankamaId)) return _cache.get(ankamaId)
  // Try generic item search by query=id then pick exact match
  const url = new URL(`${BASE}/items/search`)
  url.searchParams.set('query', String(ankamaId))
  url.searchParams.set('limit', '5')
  const r = await fetch(url)
  if (!r.ok) return null
  const list = await r.json()
  const found = list.find(it => Number(it.ankama_id) === Number(ankamaId)) || list[0] || null
  if (found) _cache.set(ankamaId, found)
  return found
}


async function tryFetch(url) {
  const r = await fetch(url)
  if (r.ok) return r.json()
  throw new Error('not found')
}

// Try different collections by ankamaId to find the ingredient's name
export async function getAnyItemById(ankamaId) {
  const id = Number(ankamaId)
  if (!id) return null
  // simple in-memory cache
  if (!window.__anyCache) window.__anyCache = new Map()
  if (window.__anyCache.has(id)) return window.__anyCache.get(id)

  const bases = [
    `${BASE}/items/equipment/${id}`,
    `${BASE}/items/resources/${id}`,
    `${BASE}/items/consumables/${id}`,
    `${BASE}/items/cosmetics/${id}`,
    `${BASE}/items/quest-items/${id}`
  ]
  for (const u of bases) {
    try {
      const obj = await tryFetch(u)
      window.__anyCache.set(id, obj)
      return obj
    } catch (e) { /* try next */ }
  }
  return null
}
