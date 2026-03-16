'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { FormField, Input, Textarea, Select, Toggle } from '@/components/admin/FormField'
import OrderButtons from '@/components/admin/OrderButtons'
import { useReorder } from '@/lib/hooks/useReorder'

interface OasisItem {
  _id?: string; title: string; arabicText: string; transliteration?: string
  meaning?: string; category: string; icon: string; color: string
  source?: string; isActive: boolean; isComingSoon: boolean; isFeatured: boolean; order: number
}

const EMPTY: Omit<OasisItem, '_id'> = {
  title: '', arabicText: '', transliteration: '', meaning: '',
  category: 'أدعية إسلامية', icon: '🌸', color: '#10B981',
  source: '', isActive: true, isComingSoon: false, isFeatured: false, order: 0,
}

const CATEGORIES = ['حفظ القرآن', 'أدعية إسلامية', 'أذكار الصباح والمساء', 'آداب إسلامية'].map(v => ({ value: v, label: v }))

export default function OasisAdminPage() {
  const [items, setItems] = useState<OasisItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<OasisItem, '_id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/oasis?active=false&limit=100')
    const data = await res.json()
    if (data.success) setItems(data.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const { move, movingId } = useReorder(items, load, '/api/oasis')

  const columns: Column<OasisItem>[] = [
    {
      key: 'order', label: '↕', width: '64px',
      render: (_, row) => (
        <OrderButtons
          idx={items.findIndex(i => i._id === row._id)}
          total={items.length} order={row.order}
          busy={movingId === row._id}
          onUp={() => move(row, 'up')} onDown={() => move(row, 'down')}
        />
      ),
    },
    { key: 'icon', label: '', width: '40px', render: v => <span className="text-2xl">{String(v)}</span> },
    { key: 'title', label: 'العنوان', render: (v, row) => (
      <div>
        <div className="font-medium text-white">{String(v)}</div>
        <div className="text-xs text-slate-400 font-arabic">{row.arabicText.substring(0, 40)}...</div>
      </div>
    )},
    { key: 'category', label: 'الفئة', render: v => <span className="text-xs text-slate-300">{String(v)}</span> },
    { key: 'isFeatured', label: 'مميز', render: v => v ? '⭐' : '-' },
    { key: 'isActive', label: 'الحالة', render: (_, row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs ${row.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
        {row.isActive ? 'نشط' : 'مخفي'}
      </span>
    )},
  ]

  const handleSave = async () => {
    setSaving(true)
    const url = editId ? `/api/oasis/${editId}` : '/api/oasis'
    const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { showToast(editId ? 'تم التحديث' : 'تم الإنشاء'); setModalOpen(false); load() }
    else showToast('خطأ: ' + data.error)
    setSaving(false)
  }

  const upd = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AdminShell title="إدارة الواحة" subtitle={`${items.length} عنصر`}
      actions={<button onClick={() => { setForm(EMPTY); setEditId(null); setModalOpen(true) }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"><span>+</span><span>إضافة محتوى</span></button>}
    >
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-xl text-sm shadow-lg">{toast}</div>}
      <DataTable data={items} columns={columns}
        onEdit={(item) => { setForm({ ...item }); setEditId(item._id ?? null); setModalOpen(true) }}
        onDelete={async (item) => { await fetch(`/api/oasis/${item._id}`, { method: 'DELETE' }); showToast('تم الحذف'); load() }}
        onToggleActive={async (item) => { await fetch(`/api/oasis/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) }); load() }}
        loading={loading} emptyMessage="لا يوجد محتوى في الواحة" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'تعديل المحتوى' : 'إضافة محتوى إسلامي'} size="xl">
        <div className="space-y-4" dir="rtl">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="العنوان" required><Input value={form.title} onChange={e => upd('title', e.target.value)} /></FormField>
            <FormField label="الفئة"><Select value={form.category} onChange={e => upd('category', e.target.value)} options={CATEGORIES} /></FormField>
          </div>
          <FormField label="النص العربي" required>
            <Textarea value={form.arabicText} onChange={e => upd('arabicText', e.target.value)} rows={3} className="text-lg leading-loose" placeholder="اكتب الآية أو الدعاء هنا..." />
          </FormField>
          <FormField label="النطق (اختياري)">
            <Input value={form.transliteration} onChange={e => upd('transliteration', e.target.value)} placeholder="Bismillah ir-rahman ir-rahim..." />
          </FormField>
          <FormField label="المعنى والتفسير">
            <Textarea value={form.meaning} onChange={e => upd('meaning', e.target.value)} rows={2} placeholder="شرح مختصر للمعنى" />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="الأيقونة"><Input value={form.icon} onChange={e => upd('icon', e.target.value)} /></FormField>
            <FormField label="المصدر"><Input value={form.source} onChange={e => upd('source', e.target.value)} placeholder="سورة الفاتحة - آية ١" /></FormField>
            <FormField label="الترتيب"><Input type="number" min={0} value={form.order} onChange={e => upd('order', +e.target.value)} /></FormField>
          </div>
          <div className="flex gap-6">
            <Toggle checked={form.isActive} onChange={v => upd('isActive', v)} label="نشط" />
            <Toggle checked={form.isComingSoon} onChange={v => upd('isComingSoon', v)} label="قريباً" />
            <Toggle checked={form.isFeatured} onChange={v => upd('isFeatured', v)} label="مميز" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 font-medium transition disabled:opacity-60">
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إنشاء المحتوى'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 transition">إلغاء</button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  )
}
