import { useState, useCallback } from 'react'

interface Orderable { _id?: string; order: number }

/**
 * Generic hook to swap `order` values between two adjacent rows.
 *
 * @param items   Sorted item array (as returned from the API, order: 1)
 * @param load    Reload callback after swap
 * @param apiPath Base path, e.g. '/api/games'  →  PUT /api/games/:id
 */
export function useReorder<T extends Orderable>(
  items: T[],
  load: () => void | Promise<void>,
  apiPath: string,
) {
  const [movingId, setMovingId] = useState<string | null>(null)

  const move = useCallback(async (item: T, dir: 'up' | 'down') => {
    const idx  = items.findIndex(i => i._id === item._id)
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= items.length) return

    const other  = items[swap]
    const aOrder = item.order  ?? idx
    const bOrder = other.order ?? swap

    setMovingId(item._id ?? null)
    await Promise.all([
      fetch(`${apiPath}/${item._id}`,  { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: bOrder }) }),
      fetch(`${apiPath}/${other._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: aOrder }) }),
    ])
    await load()
    setMovingId(null)
  }, [items, load, apiPath])

  return { move, movingId }
}
