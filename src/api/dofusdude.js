
const BASE = 'https://api.dofusdu.de/dofus3/v1/fr'

export async function searchItems(query, limit = 20) {
  const url = new URL(`${BASE}/items/search`)
  url.searchParams.set('query', query || '*')
  url.searchParams.set('limit', String(limit))
  const r = await fetch(url)
  if (!r.ok) throw new Error('API search error')
  return r.json()
}

// Fetch equipment detail by Ankama ID (includes recipe for equipment)
export async function getEquipment(ankamaId) {
  const r = await fetch(`${BASE}/items/equipment/${ankamaId}`)
  if (!r.ok) throw new Error('API item error')
  return r.json()
}

// Generic getter for resources/consumables if needed later
export async function getResource(ankamaId) {
  const r = await fetch(`${BASE}/items/resources/${ankamaId}`)
  if (!r.ok) throw new Error('API resource error')
  return r.json()
}
