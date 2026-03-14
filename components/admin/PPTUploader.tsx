'use client'
import { useState } from 'react'

interface Props {
  value?: string
  onChange: (url: string | undefined) => void
}

export default function PPTUploader({ value, onChange }: Props) {
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)

  const save = () => {
    let raw = draft.trim()
    if (!raw) { setError('أدخل الرابط أو كود iframe'); return }
    const srcMatch = raw.match(/src=["']([^"']+)["']/i)
    if (srcMatch) {
      raw = srcMatch[1].replace(/&amp;/g, '&')
    } else if (!raw.startsWith('http')) {
      setError('رابط غير صالح'); return
    }
    setError(null)
    onChange(raw)
  }

  if (value) {
    return (
      <div className="flex items-center gap-3 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3">
        <span className="text-xl shrink-0">🔗</span>
        <p className="flex-1 text-slate-300 text-xs truncate">{value}</p>
        <button onClick={() => onChange(undefined)} className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition shrink-0">حذف</button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder={'الصق رابط التضمين أو كود <iframe> هنا'}
          className="flex-1 bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
          rows={3}
          dir="ltr"
        />
        <button onClick={save} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shrink-0">حفظ</button>
      </div>
      {error && <p className="text-red-400 text-xs flex items-center gap-1"><span>⚠</span><span>{error}</span></p>}
    </div>
  )
}
