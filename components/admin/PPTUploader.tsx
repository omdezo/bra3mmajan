'use client'
import { useRef, useState } from 'react'

interface Props {
  value?: string
  onChange: (url: string | undefined) => void
}

const ACCEPTED = '.ppt,.pptx,.pdf,.key'

export default function PPTUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    const ok = /\.(ppt|pptx|pdf|key)$/i.test(file.name)
    if (!ok) { setError('يرجى رفع ملف PowerPoint أو PDF'); return }

    const maxMB = 100
    if (file.size > maxMB * 1024 * 1024) { setError(`الحجم الأقصى ${maxMB} MB`); return }

    setError(null)
    setUploading(true)
    setProgress(0)

    try {
      // 1. Get presigned URL
      const res = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream', folder: 'presentations' }),
      })
      if (!res.ok) throw new Error('Presign failed')
      const { presignedUrl, publicUrl } = await res.json()

      // 2. Upload directly to R2 (track progress)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`HTTP ${xhr.status}`)))
        xhr.onerror = () => reject(new Error('Network error'))
        xhr.open('PUT', presignedUrl)
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
        xhr.send(file)
      })

      onChange(publicUrl)
    } catch (e) {
      console.error(e)
      setError('فشل الرفع — تأكد من إعداد R2 وإضافة متغيرات البيئة')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) upload(f)
  }

  const fileSizeLabel = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

  // Derive display filename from URL
  const fileName = value ? decodeURIComponent(value.split('/').pop() ?? 'file') : null

  return (
    <div className="space-y-2">
      {value ? (
        /* ── Existing file ── */
        <div className="flex items-center gap-3 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-xl">📊</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{fileName}</p>
            <p className="text-slate-400 text-xs">عرض تقديمي مرفق</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-bold transition"
            >
              معاينة
            </a>
            <button
              onClick={() => onChange(undefined)}
              className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition"
            >
              حذف
            </button>
          </div>
        </div>
      ) : (
        /* ── Upload zone ── */
        <div
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            uploading
              ? 'border-amber-400/60 bg-amber-400/5 cursor-wait'
              : dragging
              ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
              : 'border-white/15 hover:border-amber-400/50 hover:bg-white/5'
          }`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }}
          />

          {uploading ? (
            <div className="space-y-3">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white text-sm font-medium">جاري الرفع… {progress}%</p>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl">📊</div>
              <p className="text-white text-sm font-semibold">
                {dragging ? 'أفلت الملف هنا' : 'اسحب ملف العرض التقديمي أو اضغط للاختيار'}
              </p>
              <p className="text-slate-400 text-xs">.pptx · .ppt · .pdf · .key — حتى 100 MB</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <span>⚠</span><span>{error}</span>
        </p>
      )}
    </div>
  )
}
