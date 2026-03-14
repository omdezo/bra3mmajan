'use client'
import { useState } from 'react'

interface Props {
  value?: string
  onChange: (url: string | undefined) => void
}

type Mode = 'embed' | 'pdf'

export default function PPTUploader({ value, onChange }: Props) {
  const [mode, setMode] = useState<Mode>('embed')
  const [draft, setDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  /* ── PDF upload to R2 ── */
  const uploadPDF = async (file: File) => {
    if (!/\.pdf$/i.test(file.name)) { setError('اختر ملف PDF فقط في هذا الوضع'); return }
    const maxGB = 1
    if (file.size > maxGB * 1024 * 1024 * 1024) { setError(`الحجم الأقصى ${maxGB} GB`); return }
    setError(null); setUploading(true); setProgress(0)
    try {
      const res = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: 'application/pdf', folder: 'presentations' }),
      })
      if (!res.ok) throw new Error('Presign failed')
      const { presignedUrl, publicUrl } = await res.json()
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)) }
        xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`HTTP ${xhr.status}`)))
        xhr.onerror = () => reject(new Error('Network error'))
        xhr.open('PUT', presignedUrl)
        xhr.setRequestHeader('Content-Type', 'application/pdf')
        xhr.send(file)
      })
      onChange(publicUrl)
    } catch (e) {
      console.error(e)
      setError('فشل الرفع')
    } finally {
      setUploading(false); setProgress(0)
    }
  }

  /* ── Save embed URL — accepts full <iframe> code or plain URL ── */
  const saveEmbed = () => {
    let raw = draft.trim()
    if (!raw) { setError('أدخل كود التضمين أو الرابط'); return }

    // Extract src="..." from full <iframe> embed code
    const srcMatch = raw.match(/src=["']([^"']+)["']/i)
    if (srcMatch) {
      raw = srcMatch[1].replace(/&amp;/g, '&')
    } else if (!raw.startsWith('http')) {
      setError('تعذّر استخراج الرابط — تأكد من نسخ كود iframe كاملاً')
      return
    }

    setError(null)
    onChange(raw)
  }

  const fileName = value ? decodeURIComponent(value.split('/').pop() ?? 'file') : null
  const isEmbedUrl = value && !value.startsWith('https://pub-')

  /* ── Already has a value ── */
  if (value) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-xl">{isEmbedUrl ? '🔗' : '📄'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {isEmbedUrl ? 'عرض تقديمي تفاعلي (OneDrive)' : fileName}
            </p>
            <p className="text-slate-400 text-xs">{isEmbedUrl ? 'رابط تضمين مباشر' : 'ملف PDF مرفوع'}</p>
          </div>
          <button
            onClick={() => onChange(undefined)}
            className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition shrink-0"
          >
            حذف
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex rounded-xl overflow-hidden border border-white/10">
        <button
          onClick={() => { setMode('embed'); setError(null) }}
          className={`flex-1 py-2 text-xs font-bold transition ${mode === 'embed' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          🔗 تضمين OneDrive (تفاعلي)
        </button>
        <button
          onClick={() => { setMode('pdf'); setError(null) }}
          className={`flex-1 py-2 text-xs font-bold transition ${mode === 'pdf' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          📄 رفع PDF
        </button>
      </div>

      {mode === 'embed' ? (
        /* ── OneDrive embed URL ── */
        <div className="space-y-3 bg-slate-800/40 border border-white/10 rounded-xl p-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300 leading-relaxed space-y-1">
            <p className="font-bold text-blue-200">كيفية الحصول على كود التضمين من SharePoint / OneDrive:</p>
            <p>١. افتح الملف في SharePoint أو OneDrive</p>
            <p>٢. اضغط <strong>File → Share → Embed</strong></p>
            <p>٣. انسخ كود الـ iframe كاملاً والصقه هنا</p>
          </div>
          <div className="flex gap-2">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={'<iframe src="https://nuosat-my.sharepoint.com/..." ...></iframe>'}
              className="flex-1 bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              rows={3}
              dir="ltr"
            />
            <button
              onClick={saveEmbed}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shrink-0"
            >
              حفظ
            </button>
          </div>
        </div>
      ) : (
        /* ── PDF upload ── */
        <label className={`block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          uploading ? 'border-amber-400/60 bg-amber-400/5 cursor-wait' : 'border-white/15 hover:border-amber-400/50 hover:bg-white/5'
        }`}>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            disabled={uploading}
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadPDF(f); e.target.value = '' }}
          />
          {uploading ? (
            <div className="space-y-3">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white text-sm font-medium">جاري الرفع… {progress}%</p>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl">📄</div>
              <p className="text-white text-sm font-semibold">اسحب ملف PDF أو اضغط للاختيار</p>
              <p className="text-slate-400 text-xs">PDF فقط — حتى 1 GB</p>
            </div>
          )}
        </label>
      )}

      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <span>⚠</span><span>{error}</span>
        </p>
      )}
    </div>
  )
}
