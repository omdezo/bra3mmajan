'use client'
import { useState } from 'react'

interface Props {
  value?: string
  onChange: (url: string | undefined) => void
}

/** Convert any Google Drive sharing URL to the embeddable /preview URL */
function normalizeGoogleDrive(url: string): string {
  // https://drive.google.com/file/d/FILE_ID/view?... → /preview
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)
  if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`

  // https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/)
  if (openMatch) return `https://drive.google.com/file/d/${openMatch[1]}/preview`

  return url
}

function extractUrl(raw: string): { url: string; error?: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { url: '' }

  // Contains HTML — extract iframe src
  if (trimmed.includes('<iframe') || trimmed.includes('<div')) {
    const m = trimmed.match(/src=["']([^"']+)["']/i)
    if (!m) return { url: '', error: 'لم يتم العثور على رابط في الكود' }
    return { url: m[1].replace(/&amp;/g, '&') }
  }

  // Normalize Google Drive links
  if (trimmed.includes('drive.google.com')) {
    return { url: normalizeGoogleDrive(trimmed) }
  }

  return { url: trimmed }
}

function detectSource(url: string): { label: string; icon: string; color: string } {
  if (url.includes('canva.com')) return { label: 'Canva', icon: '🎨', color: 'text-pink-400' }
  if (url.includes('drive.google.com')) return { label: 'Google Drive PDF', icon: '📁', color: 'text-blue-400' }
  if (url.includes('1drv.ms') || url.includes('onedrive')) return { label: 'OneDrive', icon: '☁️', color: 'text-sky-400' }
  if (url.includes('docs.google.com')) return { label: 'Google Slides', icon: '📑', color: 'text-green-400' }
  if (/\.pdf$/i.test(url)) return { label: 'PDF', icon: '📄', color: 'text-red-400' }
  return { label: 'رابط', icon: '🔗', color: 'text-slate-400' }
}

export default function PPTUploader({ value, onChange }: Props) {
  const [draft, setDraft] = useState(value ?? '')
  const [error, setError] = useState('')

  if (value) {
    const src = detectSource(value)
    return (
      <div className="flex items-center gap-3 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3">
        <span className="text-xl shrink-0">{src.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold mb-0.5 ${src.color}`}>{src.label}</p>
          <p className="text-slate-300 text-xs truncate" dir="ltr">{value}</p>
        </div>
        <button
          onClick={() => onChange(undefined)}
          className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition shrink-0"
        >
          حذف
        </button>
      </div>
    )
  }

  const preview = extractUrl(draft)
  const src = preview.url ? detectSource(preview.url) : null

  const save = () => {
    const { url, error: err } = extractUrl(draft)
    if (err) { setError(err); return }
    if (!url) { setError('الرجاء إدخال رابط أو كود التضمين'); return }
    setError('')
    onChange(url)
  }

  return (
    <div className="space-y-2">
      <textarea
        value={draft}
        onChange={e => { setDraft(e.target.value); setError('') }}
        placeholder={'الصق الرابط المباشر أو كود التضمين...\n\n• Canva: https://www.canva.com/...\n• Google Drive PDF: https://drive.google.com/file/d/.../view\n• أو الصق كود <iframe> كاملاً'}
        rows={4}
        className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none font-mono"
        dir="ltr"
      />

      {/* Live preview */}
      {draft.trim() && (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${preview.error ? 'bg-red-500/10 text-red-400' : 'bg-slate-800/60 text-slate-300'}`}>
          {preview.error ? (
            <><span>⚠️</span><span>{preview.error}</span></>
          ) : src ? (
            <><span>{src.icon}</span><span className={src.color}>{src.label}</span><span className="text-slate-500 truncate" dir="ltr">{preview.url}</span></>
          ) : null}
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        onClick={save}
        disabled={!draft.trim() || !!preview.error}
        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition"
      >
        حفظ
      </button>
    </div>
  )
}
