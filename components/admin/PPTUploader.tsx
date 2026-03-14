'use client'
import { useRef, useState } from 'react'

interface Props {
  value?: string
  onChange: (url: string | undefined) => void
}

const ACCEPTED = '.ppt,.pptx,.pdf,.key'

export default function PPTUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    const ok = /\.(ppt|pptx|pdf|key)$/i.test(file.name)
    if (!ok) { setError('يرجى رفع ملف PowerPoint أو PDF'); return }

    const maxGB = 1
    if (file.size > maxGB * 1024 * 1024 * 1024) { setError(`الحجم الأقصى ${maxGB} GB`); return }

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

      // 2. Upload directly to R2
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

      setUploading(false)

      // 3. Convert PPT → PDF for reliable viewing (PDFs skip this step)
      const isPDF = /\.pdf$/i.test(file.name)
      if (!isPDF) {
        setConverting(true)
        try {
          const convertRes = await fetch('/api/convert-ppt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pptUrl: publicUrl }),
          })
          const convertData = await convertRes.json()
          if (convertRes.ok && convertData.pdfUrl) {
            onChange(convertData.pdfUrl)
          } else {
            // Fall back to original PPT URL
            onChange(publicUrl)
            setError(convertData.error ?? 'فشل التحويل — سيتم عرض الملف مباشرة')
          }
        } catch {
          onChange(publicUrl)
          setError('فشل التحويل — سيتم عرض الملف مباشرة')
        } finally {
          setConverting(false)
        }
      } else {
        onChange(publicUrl)
      }
    } catch (e) {
      console.error(e)
      setError('فشل الرفع — تأكد من إعداد R2 وإضافة متغيرات البيئة')
      setUploading(false)
    } finally {
      setProgress(0)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) upload(f)
  }

  const fileName = value ? decodeURIComponent(value.split('/').pop() ?? 'file') : null
  const busy = uploading || converting

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-center gap-3 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-xl">📊</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{fileName}</p>
            <p className="text-slate-400 text-xs">عرض تقديمي مرفق</p>
          </div>
          <button
            onClick={() => onChange(undefined)}
            className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition shrink-0"
          >
            حذف
          </button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            busy
              ? 'border-amber-400/60 bg-amber-400/5 cursor-wait'
              : dragging
              ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
              : 'border-white/15 hover:border-amber-400/50 hover:bg-white/5'
          }`}
          onClick={() => !busy && inputRef.current?.click()}
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
          ) : converting ? (
            <div className="space-y-3">
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white text-sm font-medium">جاري تحويل الملف إلى PDF…</p>
              <p className="text-slate-400 text-xs">قد يستغرق هذا دقيقة أو أكثر حسب حجم الملف</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl">📊</div>
              <p className="text-white text-sm font-semibold">
                {dragging ? 'أفلت الملف هنا' : 'اسحب ملف العرض التقديمي أو اضغط للاختيار'}
              </p>
              <p className="text-slate-400 text-xs">.pptx · .ppt · .pdf · .key — حتى 1 GB</p>
              <p className="text-slate-500 text-xs">سيتم تحويل PPT/PPTX تلقائياً إلى PDF للعرض</p>
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
