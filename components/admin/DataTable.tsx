'use client'
import { useState } from 'react'

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: unknown, row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T extends { _id?: string }> {
  data: T[]
  columns: Column<T>[]
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onToggleActive?: (row: T) => void
  loading?: boolean
  emptyMessage?: string
}

export default function DataTable<T extends { _id?: string; isActive?: boolean }>({
  data,
  columns,
  onEdit,
  onDelete,
  onToggleActive,
  loading,
  emptyMessage = 'لا توجد بيانات',
}: DataTableProps<T>) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (row: T) => {
    if (!row._id) return
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return
    setDeletingId(row._id)
    await onDelete?.(row)
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">جاري التحميل...</span>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-12 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-3">📭</div>
          <div className="text-sm">{emptyMessage}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete || onToggleActive) && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-32">
                  إجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, i) => (
              <tr key={row._id ?? i} className="hover:bg-white/2 transition-colors group">
                {columns.map(col => (
                  <td key={String(col.key)} className="px-4 py-3 text-slate-300">
                    {col.render
                      ? col.render(
                          col.key.toString().includes('.')
                            ? col.key.toString().split('.').reduce((o: unknown, k) => (o as Record<string, unknown>)?.[k], row)
                            : (row as Record<string, unknown>)[col.key.toString()],
                          row
                        )
                      : String((row as Record<string, unknown>)[col.key.toString()] ?? '-')}
                  </td>
                ))}
                {(onEdit || onDelete || onToggleActive) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {onToggleActive && (
                        <button
                          onClick={() => onToggleActive(row)}
                          title={row.isActive ? 'إخفاء' : 'إظهار'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition text-xs ${
                            row.isActive
                              ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              : 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20'
                          }`}
                        >
                          {row.isActive ? '👁' : '🙈'}
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition text-xs"
                          title="تعديل"
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(row)}
                          disabled={deletingId === row._id}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition text-xs disabled:opacity-50"
                          title="حذف"
                        >
                          {deletingId === row._id ? '⏳' : '🗑️'}
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
