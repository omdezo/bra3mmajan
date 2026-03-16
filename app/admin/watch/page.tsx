'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { FormField, Input, Textarea, Select, Toggle } from '@/components/admin/FormField'
import OrderButtons from '@/components/admin/OrderButtons'
import { useReorder } from '@/lib/hooks/useReorder'

type VideoSource = 'youtube' | 'drive'

interface Video {
  _id?: string
  title: string
  description: string
  category: string
  source?: VideoSource
  youtubeId?: string
  videoUrl?: string
  thumbnailUrl?: string
  duration: number
  icon: string
  color: string
  isActive: boolean
  isComingSoon: boolean
  isFeatured: boolean
  order: number
}

const EMPTY: Omit<Video, '_id'> = {
  title: '', description: '', category: 'رسوم متحركة',
  source: 'youtube', youtubeId: '', videoUrl: '', thumbnailUrl: '',
  duration: 0, icon: '🎬', color: '#EC4899',
  isActive: true, isComingSoon: false, isFeatured: false, order: 0,
}

const CATEGORIES = ['رسوم متحركة', 'أناشيد', 'فيديوهات تعليمية', 'برامج أطفال'].map(v => ({ value: v, label: v }))

function ytThumb(id: string) {
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''
}

export default function WatchAdminPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<Video, '_id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [thumbProcessing, setThumbProcessing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/watch?active=false&limit=100')
    const data = await res.json()
    if (data.success) setVideos(data.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const { move, movingId } = useReorder(videos, load, '/api/watch')

  const columns: Column<Video>[] = [
    {
      key: 'order', label: '↕', width: '64px',
      render: (_, row) => (
        <OrderButtons
          idx={videos.findIndex(i => i._id === row._id)}
          total={videos.length} order={row.order}
          busy={movingId === row._id}
          onUp={() => move(row, 'up')} onDown={() => move(row, 'down')}
        />
      ),
    },
    {
      key: 'thumbnailUrl', label: '', width: '72px',
      render: (v, row) => {
        const thumb = v ? String(v) : (row.youtubeId ? ytThumb(row.youtubeId) : '')
        return thumb ? <img src={thumb} alt="" className="w-14 h-10 object-cover rounded-lg" /> : <span className="text-2xl">{row.icon}</span>
      },
    },
    {
      key: 'title', label: 'العنوان',
      render: (v, row) => (
        <div>
          <div className="font-medium text-white">{String(v)}</div>
          <div className="text-xs text-slate-400">{row.category}</div>
        </div>
      ),
    },
    {
      key: 'youtubeId', label: 'المصدر',
      render: (v, row) => v ? (
        <span className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
          <span className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center text-white text-[10px]">▶</span>YouTube
        </span>
      ) : row.videoUrl ? (
        <span className="flex items-center gap-1.5 text-xs text-blue-400 font-medium"><span>🗂️</span> Drive</span>
      ) : <span className="text-xs text-slate-500">-</span>,
    },
    { key: 'duration', label: 'المدة', render: v => (v ? `${v} دقيقة` : '-') },
    {
      key: 'isComingSoon', label: 'الحالة',
      render: (_, row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs ${row.isComingSoon ? 'bg-yellow-500/20 text-yellow-400' : row.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
          {row.isComingSoon ? 'قريباً' : row.isActive ? 'نشط' : 'مخفي'}
        </span>
      ),
    },
  ]

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true) }
  const openEdit = (v: Video) => {
    const source: VideoSource = v.youtubeId ? 'youtube' : 'drive'
    setForm({ ...v, source })
    setEditId(v._id ?? null)
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload: Omit<Video, '_id' | 'source'> & { source?: VideoSource } = { ...form }

    if (form.source === 'youtube') {
      payload.videoUrl = ''
      if (!payload.thumbnailUrl && form.youtubeId) {
        payload.thumbnailUrl = ytThumb(form.youtubeId)
      }
    } else {
      payload.youtubeId = ''
    }
    delete payload.source

    const url = editId ? `/api/watch/${editId}` : '/api/watch'
    const res = await fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.success) { showToast(editId ? 'تم التحديث' : 'تم الإنشاء'); setModalOpen(false); load() }
    else showToast('خطأ: ' + data.error)
    setSaving(false)
  }

  const upd = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  // Compress and convert to base64
  const handleThumbFile = (file: File) => {
    setThumbProcessing(true)
    const img = document.createElement('img')
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxW = 640
      const ratio = Math.min(maxW / img.naturalWidth, 1)
      canvas.width = Math.round(img.naturalWidth * ratio)
      canvas.height = Math.round(img.naturalHeight * ratio)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      upd('thumbnailUrl', canvas.toDataURL('image/jpeg', 0.82))
      URL.revokeObjectURL(objectUrl)
      setThumbProcessing(false)
    }
    img.onerror = () => { showToast('تعذّر قراءة الصورة'); setThumbProcessing(false) }
    img.src = objectUrl
  }

  const previewThumb =
    form.thumbnailUrl ||
    (form.source === 'youtube' && form.youtubeId ? ytThumb(form.youtubeId) : '')
  const isAutoThumb = !form.thumbnailUrl && form.source === 'youtube' && !!form.youtubeId

  return (
    <AdminShell
      title="إدارة المشاهدة"
      subtitle={`${videos.length} فيديو`}
      actions={
        <button
          onClick={openCreate}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
        >
          <span>+</span><span>إضافة فيديو</span>
        </button>
      }
    >
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-xl text-sm shadow-lg">
          {toast}
        </div>
      )}

      <DataTable
        data={videos}
        columns={columns}
        onEdit={openEdit}
        onDelete={async v => { await fetch(`/api/watch/${v._id}`, { method: 'DELETE' }); showToast('تم الحذف'); load() }}
        onToggleActive={async v => {
          await fetch(`/api/watch/${v._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: !v.isActive }),
          })
          load()
        }}
        loading={loading}
        emptyMessage="لا توجد فيديوهات"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'تعديل الفيديو' : 'إضافة فيديو'}
        size="lg"
      >
        <div className="space-y-5" dir="rtl">

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="العنوان" required>
              <Input value={form.title} onChange={e => upd('title', e.target.value)} />
            </FormField>
            <FormField label="الفئة">
              <Select value={form.category} onChange={e => upd('category', e.target.value)} options={CATEGORIES} />
            </FormField>
          </div>
          <FormField label="الوصف">
            <Textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={2} />
          </FormField>

          {/* Source Picker */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-2.5">مصدر الفيديو</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => upd('source', 'youtube')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-right ${
                  form.source === 'youtube'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-white/10 hover:border-white/20 bg-slate-800/50'
                }`}
              >
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">
                  ▶
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">YouTube</div>
                  <div className="text-xs text-slate-400">أدخل معرّف الفيديو</div>
                </div>
                {form.source === 'youtube' && (
                  <div className="mr-auto w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => upd('source', 'drive')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-right ${
                  form.source === 'drive'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 hover:border-white/20 bg-slate-800/50'
                }`}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">
                  🗂️
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">Google Drive</div>
                  <div className="text-xs text-slate-400">رابط مباشر للفيديو</div>
                </div>
                {form.source === 'drive' && (
                  <div className="mr-auto w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Source-specific input */}
          {form.source === 'youtube' ? (
            <FormField
              label="معرّف YouTube (Video ID)"
              required
              hint="مثال: من الرابط youtube.com/watch?v=dQw4w9WgXcQ — الكود هو dQw4w9WgXcQ"
            >
              <Input
                value={form.youtubeId}
                onChange={e => upd('youtubeId', e.target.value.trim())}
                placeholder="dQw4w9WgXcQ"
                className="font-mono tracking-wide"
                dir="ltr"
              />
            </FormField>
          ) : (
            <FormField
              label="رابط Google Drive المباشر"
              required
              hint="افتح الفيديو في Drive ← مشاركة ← نسخ الرابط"
            >
              <Input
                value={form.videoUrl}
                onChange={e => upd('videoUrl', e.target.value.trim())}
                placeholder="https://drive.google.com/file/d/..."
                dir="ltr"
              />
            </FormField>
          )}

          <FormField label="المدة (بالدقائق)">
            <Input
              type="number"
              min={0}
              value={form.duration}
              onChange={e => upd('duration', +e.target.value)}
              className="w-32"
            />
          </FormField>

          {/* Thumbnail */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-2.5">الصورة المصغرة (Thumbnail)</p>

            {/* Preview */}
            {previewThumb && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-slate-700">
                <img src={previewThumb} alt="معاينة" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {isAutoThumb && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                    <span>✓</span><span>تلقائي من YouTube</span>
                  </div>
                )}
                <button
                  onClick={() => upd('thumbnailUrl', '')}
                  className="absolute top-2 left-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition"
                  title="إزالة الصورة"
                >
                  ✕
                </button>
              </div>
            )}

            {form.source === 'youtube' && !form.thumbnailUrl && (
              <p className="text-xs text-emerald-400 mb-3 flex items-center gap-1">
                <span>✓</span>
                {form.youtubeId
                  ? 'سيتم استخدام الصورة المصغرة من YouTube تلقائياً — أو ارفع صورة مخصصة أدناه'
                  : 'أدخل معرّف YouTube أولاً لتظهر الصورة تلقائياً'}
              </p>
            )}

            {/* Drop zone */}
            <div
              className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-pink-500/60 hover:bg-pink-500/5 transition-all"
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault()
                const f = e.dataTransfer.files[0]
                if (f && f.type.startsWith('image/')) handleThumbFile(f)
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleThumbFile(f); e.target.value = '' }}
              />
              {thumbProcessing ? (
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                  <span>جاري معالجة الصورة...</span>
                </div>
              ) : (
                <>
                  <div className="text-3xl mb-2">🖼️</div>
                  <div className="text-sm text-slate-300 font-medium mb-1">
                    {form.thumbnailUrl ? 'تغيير الصورة المصغرة' : 'ارفع صورة مصغرة مخصصة'}
                  </div>
                  <div className="text-xs text-slate-500">
                    اسحب وأفلت أو اضغط للاختيار · JPG أو PNG · يُضغط تلقائياً
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-1">
            <Toggle checked={form.isActive} onChange={v => upd('isActive', v)} label="نشط" />
            <Toggle checked={form.isComingSoon} onChange={v => upd('isComingSoon', v)} label="قريباً" />
            <Toggle checked={form.isFeatured} onChange={v => upd('isFeatured', v)} label="مميز" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-2.5 font-medium transition disabled:opacity-60"
            >
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إنشاء الفيديو'}
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 transition"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  )
}
