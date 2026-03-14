'use client'
import { useState } from 'react'
import JSZip from 'jszip'

interface Props {
  value?: string
  onChange: (url: string | undefined) => void
}

type Mode = 'html5' | 'embed' | 'pdf'

const MIME: Record<string, string> = {
  html: 'text/html', css: 'text/css', js: 'application/javascript',
  json: 'application/json', xml: 'application/xml', txt: 'text/plain',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  gif: 'image/gif', svg: 'image/svg+xml', ico: 'image/x-icon', webp: 'image/webp',
  mp4: 'video/mp4', webm: 'video/webm', mp3: 'audio/mpeg', ogg: 'audio/ogg',
  woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf',
  swf: 'application/x-shockwave-flash', pdf: 'application/pdf',
}

function mimeOf(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  return MIME[ext] ?? 'application/octet-stream'
}

export default function PPTUploader({ value, onChange }: Props) {
  const [mode, setMode] = useState<Mode>('html5')
  const [draft, setDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)   // pdf upload %
  const [zipStatus, setZipStatus] = useState('')  // html5 upload status text
  const [zipDone, setZipDone] = useState(0)
  const [zipTotal, setZipTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  /* ── iSpring HTML5 ZIP upload ── */
  const uploadZip = async (file: File) => {
    if (!/\.zip$/i.test(file.name)) { setError('اختر ملف ZIP فقط'); return }
    setError(null); setUploading(true); setZipStatus('جاري فك الضغط…'); setZipDone(0); setZipTotal(0)

    try {
      const zip = await JSZip.loadAsync(file)

      // Collect all real files (skip directories)
      const entries: { path: string; blob: Blob; contentType: string }[] = []
      for (const [path, entry] of Object.entries(zip.files)) {
        if (entry.dir) continue
        const blob = await entry.async('blob')
        entries.push({ path, blob, contentType: mimeOf(path) })
      }

      if (!entries.find(e => e.path === 'index.html' || e.path.endsWith('/index.html'))) {
        setError('لم يتم العثور على index.html — تأكد من رفع حزمة iSpring الصحيحة'); setUploading(false); return
      }

      setZipTotal(entries.length)
      setZipStatus(`جاري الحصول على روابط الرفع… (${entries.length} ملف)`)

      // Get all presigned URLs in one request
      const batchRes = await fetch('/api/upload/presign-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: entries.map(e => ({ path: e.path, contentType: e.contentType })) }),
      })
      if (!batchRes.ok) throw new Error('Batch presign failed')
      const { indexUrl, files: presigned } = await batchRes.json()

      // Upload files 6 at a time
      setZipStatus('جاري الرفع…')
      const map = new Map(presigned.map((f: { path: string; presignedUrl: string }) => [f.path, f.presignedUrl]))
      let done = 0

      const chunks = []
      for (let i = 0; i < entries.length; i += 6) chunks.push(entries.slice(i, i + 6))

      for (const chunk of chunks) {
        await Promise.all(chunk.map(async ({ path, blob, contentType }) => {
          const url = map.get(path)
          if (!url) return
          const res = await fetch(url as string, { method: 'PUT', body: blob, headers: { 'Content-Type': contentType } })
          if (!res.ok) throw new Error(`Upload failed: ${path}`)
          done++
          setZipDone(done)
        }))
      }

      onChange(indexUrl)
    } catch (e) {
      console.error(e)
      setError('فشل الرفع — تحقق من الملف وإعدادات R2')
    } finally {
      setUploading(false); setZipStatus('')
    }
  }

  /* ── PDF upload to R2 ── */
  const uploadPDF = async (file: File) => {
    if (!/\.pdf$/i.test(file.name)) { setError('اختر ملف PDF فقط'); return }
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
      console.error(e); setError('فشل الرفع')
    } finally {
      setUploading(false); setProgress(0)
    }
  }

  /* ── Save embed URL ── */
  const saveEmbed = () => {
    let raw = draft.trim()
    if (!raw) { setError('أدخل كود التضمين أو الرابط'); return }
    const srcMatch = raw.match(/src=["']([^"']+)["']/i)
    if (srcMatch) {
      raw = srcMatch[1].replace(/&amp;/g, '&')
    } else if (!raw.startsWith('http')) {
      setError('تعذّر استخراج الرابط — تأكد من نسخ كود iframe كاملاً'); return
    }
    setError(null); onChange(raw)
  }

  const isHtml5 = value?.includes('/pkg-')
  const isEmbed = value && !value.startsWith('https://pub-')

  /* ── Already has a value ── */
  if (value) {
    return (
      <div className="flex items-center gap-3 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3">
        <span className="text-xl shrink-0">{isHtml5 ? '🌐' : isEmbed ? '🔗' : '📄'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">
            {isHtml5 ? 'حزمة HTML5 (iSpring)' : isEmbed ? 'عرض OneDrive تفاعلي' : 'ملف PDF'}
          </p>
          <p className="text-slate-400 text-xs truncate">{value}</p>
        </div>
        <button onClick={() => onChange(undefined)} className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition shrink-0">حذف</button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-white/10 text-xs">
        {([['html5', '🌐 iSpring HTML5'], ['embed', '🔗 OneDrive'], ['pdf', '📄 PDF']] as const).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setError(null) }}
            className={`flex-1 py-2 font-bold transition ${mode === m ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'html5' && (
        <label className={`block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          uploading ? 'border-amber-400/60 bg-amber-400/5 cursor-wait' : 'border-white/15 hover:border-amber-400/50 hover:bg-white/5'
        }`}>
          <input type="file" accept=".zip" className="hidden" disabled={uploading}
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadZip(f); e.target.value = '' }} />
          {uploading ? (
            <div className="space-y-3">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white text-sm font-medium">{zipStatus}</p>
              {zipTotal > 0 && (
                <>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((zipDone / zipTotal) * 100)}%` }} />
                  </div>
                  <p className="text-slate-400 text-xs">{zipDone} / {zipTotal} ملف</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl">🌐</div>
              <p className="text-white text-sm font-semibold">ارفع حزمة iSpring (ZIP)</p>
              <p className="text-slate-400 text-xs">١. افتح PowerPoint → iSpring Free → Publish</p>
              <p className="text-slate-400 text-xs">٢. اختر "HTML5" → احفظ → ضغّط المجلد كـ ZIP</p>
              <p className="text-slate-400 text-xs">٣. ارفع ملف ZIP هنا</p>
            </div>
          )}
        </label>
      )}

      {mode === 'embed' && (
        <div className="space-y-3 bg-slate-800/40 border border-white/10 rounded-xl p-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300 space-y-1">
            <p className="font-bold text-blue-200">كود التضمين من OneDrive / SharePoint:</p>
            <p>افتح الملف ← <strong>File → Share → Embed</strong> ← انسخ كود iframe</p>
          </div>
          <div className="flex gap-2">
            <textarea value={draft} onChange={e => setDraft(e.target.value)}
              placeholder={'<iframe src="https://1drv.ms/..." ...></iframe>'}
              className="flex-1 bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              rows={3} dir="ltr" />
            <button onClick={saveEmbed} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shrink-0">حفظ</button>
          </div>
        </div>
      )}

      {mode === 'pdf' && (
        <label className={`block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          uploading ? 'border-amber-400/60 bg-amber-400/5 cursor-wait' : 'border-white/15 hover:border-amber-400/50 hover:bg-white/5'
        }`}>
          <input type="file" accept=".pdf" className="hidden" disabled={uploading}
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadPDF(f); e.target.value = '' }} />
          {uploading ? (
            <div className="space-y-3">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white text-sm font-medium">جاري الرفع… {progress}%</p>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl">📄</div>
              <p className="text-white text-sm font-semibold">اسحب PDF أو اضغط للاختيار</p>
              <p className="text-slate-400 text-xs">PDF فقط — حتى 1 GB</p>
            </div>
          )}
        </label>
      )}

      {error && <p className="text-red-400 text-xs flex items-center gap-1"><span>⚠</span><span>{error}</span></p>}
    </div>
  )
}
