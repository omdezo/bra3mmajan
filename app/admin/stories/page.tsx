'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { FormField, Input, Textarea, Select, Toggle } from '@/components/admin/FormField'
import { useReorder } from '@/lib/hooks/useReorder'

interface Story {
  _id?: string
  title: string
  description: string
  link?: string
  category: string
  icon: string
  color: string
  coverImage?: string
  readTime: number
  isActive: boolean
  isComingSoon: boolean
  isFeatured: boolean
  order: number
}

const EMPTY: Omit<Story, '_id'> = {
  title: '', description: '', link: '',
  category: 'حكايات عُمانية', icon: '📖', color: '#7C3AED',
  coverImage: '', readTime: 5,
  isActive: true, isComingSoon: false, isFeatured: false, order: 0,
}

const CATEGORIES = ['حكايات عُمانية', 'قصص الأنبياء', 'قصص أخلاقية', 'مغامرات مصورة'].map(v => ({ value: v, label: v }))

export default function StoriesAdminPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<Story, '_id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [imgProcessing, setImgProcessing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/stories?active=false&limit=100')
    const data = await res.json()
    if (data.success) setStories(data.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const { reorder } = useReorder(stories, setStories, '/api/stories')

  const columns: Column<Story>[] = [
    { key: 'coverImage', label: '', width: '72px', render: (v, row) => v ? <img src={String(v)} alt="" className="w-14 h-10 object-cover rounded-lg" /> : <span className="text-2xl">{row.icon}</span> },
    { key: 'title', label: 'العنوان', render: (v, row) => (<div><div className="font-medium text-white">{String(v)}</div><div className="text-xs text-slate-400">{row.category}</div></div>) },
    { key: 'link', label: 'الرابط', render: v => v ? <a href={String(v)} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate max-w-[160px] block" onClick={e => e.stopPropagation()}>{String(v).replace(/^https?:\/\//, '')}</a> : <span className="text-xs text-slate-500">بدون رابط</span> },
    { key: 'readTime', label: 'وقت القراءة', render: v => `${v} دقائق` },
    { key: 'isComingSoon', label: 'الحالة', render: (_, row) => (<span className={`px-2 py-0.5 rounded-full text-xs ${row.isComingSoon ? 'bg-yellow-500/20 text-yellow-400' : row.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>{row.isComingSoon ? 'قريباً' : row.isActive ? 'نشط' : 'مخفي'}</span>) },
  ]

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true) }
  const openEdit = (s: Story) => { setForm({ ...s }); setEditId(s._id ?? null); setModalOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const url = editId ? `/api/stories/${editId}` : '/api/stories'
    const res = await fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.success) { showToast(editId ? 'تم تحديث القصة' : 'تم إنشاء القصة'); setModalOpen(false); load() }
    else showToast('خطأ: ' + data.error)
    setSaving(false)
  }

  const upd = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  // Compress uploaded cover image to base64
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) { showToast('يرجى اختيار ملف صورة'); return }
    setImgProcessing(true)
    const img = document.createElement('img')
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxW = 800
      const ratio = Math.min(maxW / img.naturalWidth, 1)
      canvas.width = Math.round(img.naturalWidth * ratio)
      canvas.height = Math.round(img.naturalHeight * ratio)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      upd('coverImage', canvas.toDataURL('image/jpeg', 0.85))
      URL.revokeObjectURL(objectUrl)
      setImgProcessing(false)
    }
    img.onerror = () => { showToast('تعذّر قراءة الصورة'); setImgProcessing(false) }
    img.src = objectUrl
  }

  return (
    <AdminShell
      title="إدارة القصص"
      subtitle={`${stories.length} قصة`}
      actions={
        <button
          onClick={openCreate}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
        >
          <span>+</span><span>إضافة قصة</span>
        </button>
      }
    >
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-xl text-sm shadow-lg">
          {toast}
        </div>
      )}

      <DataTable
        data={stories}
        columns={columns}
        onEdit={openEdit}
        onReorder={reorder}
        onDelete={async s => { await fetch(`/api/stories/${s._id}`, { method: 'DELETE' }); showToast('تم الحذف'); load() }}
        onToggleActive={async s => {
          await fetch(`/api/stories/${s._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: !s.isActive }),
          })
          load()
        }}
        loading={loading}
        emptyMessage="لا توجد قصص"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'تعديل القصة' : 'إضافة قصة'}
        size="lg"
      >
        <div className="space-y-5" dir="rtl">

          {/* Cover Image Upload */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-2.5">صورة الغلاف</p>

            {/* Preview */}
            {form.coverImage && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-slate-700">
                <img src={form.coverImage} alt="معاينة" className="w-full h-full object-cover" />
                <button
                  onClick={() => upd('coverImage', '')}
                  className="absolute top-2 left-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition"
                  title="إزالة الصورة"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Drop zone */}
            <div
              className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-yellow-500/60 hover:bg-yellow-500/5 transition-all"
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault()
                const f = e.dataTransfer.files[0]
                if (f) handleImageFile(f)
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = '' }}
              />
              {imgProcessing ? (
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  <span>جاري معالجة الصورة...</span>
                </div>
              ) : (
                <>
                  <div className="text-3xl mb-2">🖼️</div>
                  <div className="text-sm text-slate-300 font-medium mb-1">
                    {form.coverImage ? 'تغيير صورة الغلاف' : 'ارفع صورة الغلاف'}
                  </div>
                  <div className="text-xs text-slate-500">
                    اسحب وأفلت أو اضغط للاختيار · JPG أو PNG · يُضغط تلقائياً
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="عنوان القصة" required>
              <Input value={form.title} onChange={e => upd('title', e.target.value)} />
            </FormField>
            <FormField label="الأيقونة">
              <Input value={form.icon} onChange={e => upd('icon', e.target.value)} />
            </FormField>
          </div>

          <FormField label="الوصف المختصر" required>
            <Textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={2} />
          </FormField>

          {/* Story Link */}
          <FormField
            label="رابط القصة"
            hint="عند الضغط على القصة سيُنقل الطفل لهذا الرابط (يوتيوب، موقع، PDF...)"
          >
            <Input
              value={form.link}
              onChange={e => upd('link', e.target.value.trim())}
              placeholder="https://..."
              dir="ltr"
            />
          </FormField>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="الفئة">
              <Select value={form.category} onChange={e => upd('category', e.target.value)} options={CATEGORIES} />
            </FormField>
            <FormField label="وقت القراءة (دقائق)">
              <Input type="number" min={1} value={form.readTime} onChange={e => upd('readTime', +e.target.value)} />
            </FormField>
            <FormField label="الترتيب">
              <Input type="number" min={0} value={form.order} onChange={e => upd('order', +e.target.value)} />
            </FormField>
          </div>

          <div className="flex gap-6">
            <Toggle checked={form.isActive} onChange={v => upd('isActive', v)} label="نشط" />
            <Toggle checked={form.isComingSoon} onChange={v => upd('isComingSoon', v)} label="قريباً" />
            <Toggle checked={form.isFeatured} onChange={v => upd('isFeatured', v)} label="مميزة" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl py-2.5 font-medium transition disabled:opacity-60"
            >
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إنشاء القصة'}
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
