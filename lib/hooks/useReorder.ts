import { useCallback } from 'react'

interface Orderable { _id?: string; order: number }

/**
 * Optimistic drag-and-drop reorder.
 * Immediately updates local state, then persists new `order` values (= array index) via PUT.
 */
export function useReorder<T extends Orderable>(
  items: T[],
  setItems: (items: T[]) => void,
  apiPath: string,
) {
  const reorder = useCallback(async (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return

    // 1. Optimistic UI update
    const next = [...items]
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    setItems(next)

    // 2. Persist: assign each item order = its new array index
    await Promise.all(
      next
        .filter(item => item._id)
        .map((item, idx) =>
          fetch(`${apiPath}/${item._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: idx }),
          })
        )
    )
  }, [items, setItems, apiPath])

  return { reorder }
}
