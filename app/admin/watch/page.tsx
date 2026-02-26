'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { FormField, Input, Textarea, Select, Toggle } from '@/components/admin/FormField'

interface Video {
  _id?: string; title: string; description: string; category: string
  youtubeId?: string; videoUrl?: string; thumbnailUrl?: string
  duration: number; icon: string; color: string
  isActive: boolean; isComingSoon: boolean; isFeatured: boolean; order: number
}

const EMPTY: Omit<Video, '_id'> = {
  title: '', description: '', category: 'رسوم متحركة', youtubeId: '',
  videoUrl: '', thumbnailUrl: '', duration: 0, icon: '🎬', color: '#EC4899',
  isActive: true, isComingSoon: false, isFeatured: false, order: 0,
}

const CATEGORIES = ['رسوم متحركة', 'أناشيد', 'فيديوهات تعليمية', 'برامج أطفال'].map(v => ({ value: v, label: v }))

const columns: Column<Video>[] = [
  { key: 'icon', label: '', width: '40px', render: v => <span className="text-2xl">{String(v)}</span> },
  { key: 'title', label: 'العنوان', render: (v, row) => (
    <div><div className="font-medium text-white">{String(v)}</div><div className="text-xs text-slate-400">{row.category}</div></div>
  )},
  { key: 'youtubeId', label: 'YouTube ID', render: v => v ? <span className="font-mono text-xs text-slate-400">{String(v)}</span> : '-' },
  { key: 'duration', label: 'المدة', render: v => v ? `${v} دقيقة` : '-' },
  { key: 'isComingSoon', label: 'الحالة', render: (_, row) => (
    <span className={`px-2 py-0.5 rounded-full text-xs ${row.isComingSoon ? 'bg-yellow-500/20 text-yellow-400' : row.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
      {row.isComingSoon ? 'قريباً' : row.isActive ? 'نشط' : 'مخفي'}
    </span>
  )},
]

export default function WatchAdminPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<Video, '_id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/watch?active=false&limit=100')
    const data = await res.json()
    if (data.success) setVideos(data.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true) }
  const openEdit = (v: Video) => { setForm({ ...v }); setEditId(v._id ?? null); setModalOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const url = editId ? `/api/watch/${editId}` : '/api/watch'
    const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { showToast(editId ? 'تم التحديث' : 'تم الإنشاء'); setModalOpen(false); load() }
    else showToast('خطأ: ' + data.error)
    setSaving(false)
  }

  const upd = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AdminShell title="إدارة المشاهدة" subtitle={`${videos.length} فيديو`}
      actions={<button onClick={openCreate} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"><span>+</span><span>إضافة فيديو</span></button>}
    >
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-xl text-sm shadow-lg">{toast}</div>}
      <DataTable data={videos} columns={columns} onEdit={openEdit}
        onDelete={async (v) => { await fetch(`/api/watch/${v._id}`, { method: 'DELETE' }); showToast('تم الحذف'); load() }}
        onToggleActive={async (v) => { await fetch(`/api/watch/${v._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !v.isActive }) }); load() }}
        loading={loading} emptyMessage="لا توجد فيديوهات" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'تعديل الفيديو' : 'إضافة فيديو'} size="lg">
        <div className="space-y-4" dir="rtl">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="العنوان" required><Input value={form.title} onChange={e => upd('title', e.target.value)} /></FormField>
            <FormField label="الفئة"><Select value={form.category} onChange={e => upd('category', e.target.value)} options={CATEGORIES} /></FormField>
          </div>
          <FormField label="الوصف"><Textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={2} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="معرّف YouTube" hint="مثال: dQw4w9WgXcQ"><Input value={form.youtubeId} onChange={e => upd('youtubeId', e.target.value)} placeholder="dQw4w9WgXcQ" /></FormField>
            <FormField label="المدة (بالدقائق)"><Input type="number" min={0} value={form.duration} onChange={e => upd('duration', +e.target.value)} /></FormField>
          </div>
          <FormField label="رابط الفيديو المباشر"><Input value={form.videoUrl} onChange={e => upd('videoUrl', e.target.value)} placeholder="https://..." /></FormField>
          <FormField label="رابط الصورة المصغرة"><Input value={form.thumbnailUrl} onChange={e => upd('thumbnailUrl', e.target.value)} placeholder="https://..." /></FormField>
          <div className="flex gap-6">
            <Toggle checked={form.isActive} onChange={v => upd('isActive', v)} label="نشط" />
            <Toggle checked={form.isComingSoon} onChange={v => upd('isComingSoon', v)} label="قريباً" />
            <Toggle checked={form.isFeatured} onChange={v => upd('isFeatured', v)} label="مميز" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-2.5 font-medium transition disabled:opacity-60">
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إنشاء الفيديو'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 transition">إلغاء</button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  )
}
