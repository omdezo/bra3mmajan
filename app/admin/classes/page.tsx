'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { FormField, Input, Textarea, Select, Toggle } from '@/components/admin/FormField'

interface ClassSession {
  _id?: string; title: string; subject: string; grade: number
  teacher: string; teamsLink: string; description?: string
  day?: string; time?: string; icon: string; color: string
  isActive: boolean; order: number
}

const EMPTY: Omit<ClassSession, '_id'> = {
  title: '', subject: 'جميع المواد', grade: 1,
  teacher: '', teamsLink: '', description: '',
  day: '', time: '', icon: '📚', color: '#3B82F6',
  isActive: true, order: 0,
}

const GRADES = [1, 2, 3, 4].map(v => ({ value: String(v), label: `الصف ${['الأول', 'الثاني', 'الثالث', 'الرابع'][v - 1]}` }))
const SUBJECTS = ['جميع المواد', 'اللغة العربية', 'الرياضيات', 'العلوم', 'التربية الإسلامية', 'اللغة الإنجليزية'].map(v => ({ value: v, label: v }))

const columns: Column<ClassSession>[] = [
  { key: 'icon', label: '', width: '40px', render: v => <span className="text-2xl">{String(v)}</span> },
  { key: 'title', label: 'الحصة', render: (v, row) => (
    <div>
      <div className="font-medium text-white">{String(v)}</div>
      <div className="text-xs text-slate-400">{['الأول', 'الثاني', 'الثالث', 'الرابع'][row.grade - 1] || row.grade} — {row.subject}</div>
    </div>
  )},
  { key: 'teacher', label: 'المعلم/ة' },
  { key: 'day', label: 'اليوم', render: v => String(v || '-') },
  { key: 'time', label: 'الوقت', render: v => String(v || '-') },
  { key: 'teamsLink', label: 'رابط Teams', render: v => v ? (
    <a href={String(v)} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">فتح الرابط ↗</a>
  ) : '-' },
  { key: 'isActive', label: 'الحالة', render: v => (
    <span className={`px-2 py-0.5 rounded-full text-xs ${v ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>{v ? 'نشط' : 'مخفي'}</span>
  )},
]

export default function ClassesAdminPage() {
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<ClassSession, '_id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/classes?active=false&limit=100')
    const data = await res.json()
    if (data.success) setSessions(data.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    setSaving(true)
    const url = editId ? `/api/classes/${editId}` : '/api/classes'
    const body = { ...form, grade: Number(form.grade) }
    const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.success) { showToast('تم الحفظ'); setModalOpen(false); load() }
    else showToast('خطأ: ' + data.error)
    setSaving(false)
  }

  const upd = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AdminShell title="إدارة الفصول الافتراضية" subtitle={`${sessions.length} حصة`}
      actions={<button onClick={() => { setForm(EMPTY); setEditId(null); setModalOpen(true) }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"><span>+</span><span>إضافة حصة</span></button>}
    >
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-xl text-sm shadow-lg">{toast}</div>}
      <DataTable data={sessions} columns={columns}
        onEdit={(s) => { setForm({ ...s }); setEditId(s._id ?? null); setModalOpen(true) }}
        onDelete={async (s) => { await fetch(`/api/classes/${s._id}`, { method: 'DELETE' }); showToast('تم الحذف'); load() }}
        onToggleActive={async (s) => { await fetch(`/api/classes/${s._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !s.isActive }) }); load() }}
        loading={loading} emptyMessage="لا توجد حصص" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'تعديل الحصة' : 'إضافة حصة جديدة'} size="lg">
        <div className="space-y-4" dir="rtl">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="عنوان الحصة" required><Input value={form.title} onChange={e => upd('title', e.target.value)} /></FormField>
            <FormField label="الصف الدراسي"><Select value={String(form.grade)} onChange={e => upd('grade', +e.target.value)} options={GRADES} /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="المادة"><Select value={form.subject} onChange={e => upd('subject', e.target.value)} options={SUBJECTS} /></FormField>
            <FormField label="اسم المعلم/ة" required><Input value={form.teacher} onChange={e => upd('teacher', e.target.value)} /></FormField>
          </div>
          <FormField label="رابط Microsoft Teams" required>
            <Input value={form.teamsLink} onChange={e => upd('teamsLink', e.target.value)} placeholder="https://teams.microsoft.com/l/meetup-join/..." />
          </FormField>
          <FormField label="الوصف">
            <Textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={2} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="اليوم"><Input value={form.day} onChange={e => upd('day', e.target.value)} placeholder="الأحد" /></FormField>
            <FormField label="الوقت"><Input value={form.time} onChange={e => upd('time', e.target.value)} placeholder="٨:٠٠ ص" /></FormField>
          </div>
          <Toggle checked={form.isActive} onChange={v => upd('isActive', v)} label="حصة نشطة" />
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-medium transition disabled:opacity-60">
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إنشاء الحصة'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 transition">إلغاء</button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  )
}
