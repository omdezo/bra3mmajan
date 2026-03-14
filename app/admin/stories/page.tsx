'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { FormField, Input, Textarea, Select, Toggle } from '@/components/admin/FormField'

interface Story {
  _id?: string
  title: string
  description: string
  content: string
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
  title: '', description: '', content: '',
  category: 'حكايات عُمانية', icon: '📖', color: '#7C3AED',
  coverImage: '', readTime: 5,
  isActive: true, isComingSoon: false, isFeatured: false, order: 0,
}

const CATEGORIES = ['حكايات عُمانية', 'قصص الأنبياء', 'قصص أخلاقية', 'مغامرات مصورة'].map(v => ({ value: v, label: v }))

const columns: Column<Story>[] = [
  { key: 'icon', label: '', width: '40px', render: v => <span className="text-2xl">{String(v)}</span> },
  { key: 'title', label: 'العنوان', render: (v, row) => (
    <div><div className="font-medium text-white">{String(v)}</div><div className="text-xs text-slate-400">{row.category}</div></div>
  )},
  { key: 'readTime', label: 'وقت القراءة', render: v => `${v} دقائق` },
  { key: 'isFeatured', label: 'مميزة', render: v => v ? '⭐ نعم' : '-' },
  { key: 'isComingSoon', label: 'الحالة', render: (_, row) => (
    <span className={`px-2 py-0.5 rounded-full text-xs ${row.isComingSoon ? 'bg-yellow-500/20 text-yellow-400' : row.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
      {row.isComingSoon ? 'قريباً' : row.isActive ? 'نشط' : 'مخفي'}
    </span>
  )},
]

export default function StoriesAdminPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<Story, '_id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/stories?active=false&limit=100')
    const data = await res.json()
    if (data.success) setStories(data.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true) }
  const openEdit = (s: Story) => { setForm({ ...s }); setEditId(s._id ?? null); setModalOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const url = editId ? `/api/stories/${editId}` : '/api/stories'
    const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { showToast(editId ? 'تم تحديث القصة' : 'تم إنشاء القصة'); setModalOpen(false); load() }
    else showToast('خطأ: ' + data.error)
    setSaving(false)
  }

  const upd = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AdminShell title="إدارة القصص" subtitle={`${stories.length} قصة`}
      actions={<button onClick={openCreate} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"><span>+</span><span>إضافة قصة</span></button>}
    >
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-xl text-sm shadow-lg">{toast}</div>}
      <DataTable data={stories} columns={columns} onEdit={openEdit}
        onDelete={async (s) => { await fetch(`/api/stories/${s._id}`, { method: 'DELETE' }); showToast('تم الحذف'); load() }}
        onToggleActive={async (s) => { await fetch(`/api/stories/${s._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !s.isActive }) }); load() }}
        loading={loading} emptyMessage="لا توجد قصص" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'تعديل القصة' : 'إضافة قصة'} size="xl">
        <div className="space-y-4" dir="rtl">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="العنوان" required><Input value={form.title} onChange={e => upd('title', e.target.value)} /></FormField>
            <FormField label="الأيقونة"><Input value={form.icon} onChange={e => upd('icon', e.target.value)} /></FormField>
          </div>
          <FormField label="الوصف" required><Textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={2} /></FormField>
          <FormField label="محتوى القصة"><Textarea value={form.content} onChange={e => upd('content', e.target.value)} rows={5} placeholder="اكتب القصة هنا..." /></FormField>
          <FormField label="صورة الغلاف" hint="رابط صورة تظهر بدلاً من الأيقونة"><Input value={form.coverImage} onChange={e => upd('coverImage', e.target.value)} placeholder="https://..." /></FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="الفئة"><Select value={form.category} onChange={e => upd('category', e.target.value)} options={CATEGORIES} /></FormField>
            <FormField label="وقت القراءة (دقائق)"><Input type="number" min={1} value={form.readTime} onChange={e => upd('readTime', +e.target.value)} /></FormField>
            <FormField label="الترتيب"><Input type="number" min={0} value={form.order} onChange={e => upd('order', +e.target.value)} /></FormField>
          </div>
          <div className="flex gap-6">
            <Toggle checked={form.isActive} onChange={v => upd('isActive', v)} label="نشط" />
            <Toggle checked={form.isComingSoon} onChange={v => upd('isComingSoon', v)} label="قريباً" />
            <Toggle checked={form.isFeatured} onChange={v => upd('isFeatured', v)} label="مميزة" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl py-2.5 font-medium transition disabled:opacity-60">
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إنشاء القصة'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 transition">إلغاء</button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  )
}
