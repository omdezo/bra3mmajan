'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { FormField, Input, Textarea, Select, Toggle } from '@/components/admin/FormField'
import PPTUploader from '@/components/admin/PPTUploader'

interface Treasure {
  _id?: string; title: string; description: string; content?: string; category: string
  icon: string; color: string; imageUrl?: string; audioUrl?: string; videoUrl?: string
  pptUrl?: string
  isActive: boolean; isComingSoon: boolean; isFeatured: boolean; order: number
}

const EMPTY: Omit<Treasure, '_id'> = {
  title: '', description: '', content: '', category: 'كنوز عُمانية',
  icon: '💎', color: '#F59E0B', imageUrl: '', audioUrl: '', videoUrl: '', pptUrl: '',
  isActive: true, isComingSoon: false, isFeatured: false, order: 0,
}

const CATEGORIES = ['ركن الإبداع', 'كنوز عُمانية', 'أغانٍ', 'أساليب تعليمية'].map(v => ({ value: v, label: v }))

const columns: Column<Treasure>[] = [
  { key: 'icon', label: '', width: '40px', render: v => <span className="text-2xl">{String(v)}</span> },
  { key: 'title', label: 'العنوان', render: (v, row) => (
    <div>
      <div className="font-medium text-white flex items-center gap-2">
        {String(v)}
        {row.pptUrl && <span title="عرض تقديمي" className="text-amber-400 text-xs">{row.pptUrl.includes('canva.com') ? '🎨' : row.pptUrl.includes('drive.google.com') ? '📁' : '📊'}</span>}
      </div>
      <div className="text-xs text-slate-400">{row.category}</div>
    </div>
  )},
  { key: 'isFeatured', label: 'مميز', render: v => v ? '⭐' : '-' },
  { key: 'isComingSoon', label: 'الحالة', render: (_, row) => (
    <span className={`px-2 py-0.5 rounded-full text-xs ${row.isComingSoon ? 'bg-yellow-500/20 text-yellow-400' : row.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
      {row.isComingSoon ? 'قريباً' : row.isActive ? 'نشط' : 'مخفي'}
    </span>
  )},
]

export default function VarietyAdminPage() {
  const [items, setItems] = useState<Treasure[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<Treasure, '_id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/variety?active=false&limit=100')
    const data = await res.json()
    if (data.success) setItems(data.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    setSaving(true)
    const url = editId ? `/api/variety/${editId}` : '/api/variety'
    const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { showToast('تم الحفظ'); setModalOpen(false); load() }
    else showToast('خطأ: ' + data.error)
    setSaving(false)
  }

  const upd = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AdminShell title="إدارة كنوز التراث" subtitle={`${items.length} عنصر`}
      actions={<button onClick={() => { setForm(EMPTY); setEditId(null); setModalOpen(true) }} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"><span>+</span><span>إضافة كنز</span></button>}
    >
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-xl text-sm shadow-lg">{toast}</div>}
      <DataTable data={items} columns={columns}
        onEdit={(item) => { setForm({ ...item }); setEditId(item._id ?? null); setModalOpen(true) }}
        onDelete={async (item) => { await fetch(`/api/variety/${item._id}`, { method: 'DELETE' }); showToast('تم الحذف'); load() }}
        onToggleActive={async (item) => { await fetch(`/api/variety/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) }); load() }}
        loading={loading} emptyMessage="لا توجد كنوز" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'تعديل الكنز' : 'إضافة كنز جديد'} size="lg">
        <div className="space-y-4" dir="rtl">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="العنوان" required><Input value={form.title} onChange={e => upd('title', e.target.value)} /></FormField>
            <FormField label="الفئة"><Select value={form.category} onChange={e => upd('category', e.target.value)} options={CATEGORIES} /></FormField>
          </div>
          <FormField label="الوصف" required><Textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={2} /></FormField>
          <FormField label="المحتوى التفصيلي"><Textarea value={form.content} onChange={e => upd('content', e.target.value)} rows={3} placeholder="معلومات تفصيلية..." /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="الأيقونة"><Input value={form.icon} onChange={e => upd('icon', e.target.value)} /></FormField>
            <FormField label="رابط الصورة"><Input value={form.imageUrl} onChange={e => upd('imageUrl', e.target.value)} placeholder="https://..." /></FormField>
          </div>
          <FormField label="رابط الصوت" hint="MP3 أو رابط مباشر للصوت"><Input value={form.audioUrl} onChange={e => upd('audioUrl', e.target.value)} placeholder="https://..." /></FormField>
          <FormField label="رابط الفيديو" hint="MP4 أو رابط مباشر للفيديو"><Input value={form.videoUrl} onChange={e => upd('videoUrl', e.target.value)} placeholder="https://..." /></FormField>

          {/* ── PPT Upload ── */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>عرض تقديمي (Canva / PowerPoint / PDF)</span>
            </p>
            <FormField label="" hint="يُعرض داخل الموقع مباشرةً بدون تحميل">
              <PPTUploader
                value={form.pptUrl || undefined}
                onChange={url => upd('pptUrl', url ?? '')}
              />
            </FormField>
          </div>

          <div className="flex gap-6">
            <Toggle checked={form.isActive} onChange={v => upd('isActive', v)} label="نشط" />
            <Toggle checked={form.isComingSoon} onChange={v => upd('isComingSoon', v)} label="قريباً" />
            <Toggle checked={form.isFeatured} onChange={v => upd('isFeatured', v)} label="مميز" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-2.5 font-medium transition disabled:opacity-60">
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إنشاء الكنز'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 transition">إلغاء</button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  )
}
