
import { openDB } from 'idb'

const DB_NAME = 'dofus-crafter'
const DB_VER = 1
const PRICES = 'ResourcePrices'
const WATCH = 'Watchlist'
const SALES = 'SalesHistory'

export async function db() {
  return openDB(DB_NAME, DB_VER, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(PRICES)) {
        const store = db.createObjectStore(PRICES, { keyPath: 'ankama_id' })
        store.createIndex('byUpdatedAt', 'lastUpdatedAt')
      }
      if (!db.objectStoreNames.contains(WATCH)) {
        db.createObjectStore(WATCH, { keyPath: 'ankama_id' })
      }
      if (!db.objectStoreNames.contains(SALES)) {
        const s = db.createObjectStore(SALES, { keyPath: 'id', autoIncrement: true })
        s.createIndex('byItem', 'itemId')
        s.createIndex('byDate', 'date')
      }
    }
  })
}

// ---- prices ----
export async function getPrice(ankama_id) {
  const d = await db()
  return d.get(PRICES, Number(ankama_id))
}

export async function setPrice({ ankama_id, name, lastUnitPrice }) {
  const d = await db()
  const val = {
    ankama_id: Number(ankama_id),
    name,
    lastUnitPrice: Number(lastUnitPrice),
    lastUpdatedAt: new Date().toISOString(),
  }
  await d.put(PRICES, val)
  return val
}

export async function allPrices() {
  const d = await db()
  return d.getAll(PRICES)
}

export async function deletePrice(ankama_id) {
  const d = await db()
  return d.delete(PRICES, Number(ankama_id))
}

// ---- watchlist ----
export async function saveToWatchlist(item) {
  const d = await db()
  await d.put(WATCH, item)
  return item
}

export async function removeFromWatchlist(ankama_id) {
  const d = await db()
  return d.delete(WATCH, Number(ankama_id))
}

export async function getWatchlist() {
  const d = await db()
  return d.getAll(WATCH)
}

// ---- sales ----
export async function addSale(entry) {
  const d = await db()
  return d.add(SALES, entry)
}

export async function getSalesByItem(itemId) {
  const d = await db()
  return d.getAllFromIndex(SALES, 'byItem', Number(itemId))
}

export async function getAllSales() {
  const d = await db()
  return d.getAll(SALES)
}
