'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import DataTable, { Column } from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import { FormField, Input, Textarea, Select, Toggle } from '@/components/admin/FormField'
import { useReorder } from '@/lib/hooks/useReorder'

interface Game {
  _id?: string
  title: string
  description: string
  category: string
  difficulty: string
  icon: string
  color: string
  stars: number
  playersCount: number
  externalLink?: string
  isExternalLink: boolean
  isActive: boolean
  isComingSoon: boolean
  order: number
}

const EMPTY: Omit<Game, '_id'> = {
  title: '', description: '', category: 'الحساب', difficulty: 'سهل',
  icon: '🎮', color: '#3B82F6', stars: 3, playersCount: 0,
  externalLink: '', isExternalLink: false,
  isActive: true, isComingSoon: false, order: 0,
}

const CATEGORIES = ['الحساب', 'اللغة العربية', 'الألغاز', 'الذاكرة', 'العلوم', 'التراث'].map(v => ({ value: v, label: v }))
const DIFFICULTIES = ['سهل', 'متوسط', 'صعب'].map(v => ({ value: v, label: v }))

export default function GamesAdminPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<Game, '_id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const loadGames = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/games?active=false&limit=100')
    const data = await res.json()
    if (data.success) setGames(data.data)
    setLoading(false)
  }, [])

  useEffect(() => { loadGames() }, [loadGames])

  const { reorder } = useReorder(games, setGames, '/api/games')

  const columns: Column<Game>[] = [
    { key: 'icon', label: '', width: '40px', render: v => <span className="text-2xl">{String(v)}</span> },
    { key: 'title', label: 'العنوان', render: (v, row) => (
      <div>
        <div className="font-medium text-white">{String(v)}</div>
        <div className="text-xs text-slate-400">{row.category}</div>
      </div>
    )},
    { key: 'difficulty', label: 'المستوى', render: v => (
      <span className={`px-2 py-0.5 rounded-full text-xs ${v === 'سهل' ? 'bg-green-500/20 text-green-400' : v === 'متوسط' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{String(v)}</span>
    )},
    { key: 'stars', label: 'النجوم', render: v => '⭐'.repeat(Number(v)) },
    { key: 'isExternalLink', label: 'النوع', render: (v, row) => v ? (
      <a href={row.externalLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline text-xs"><span>🔗</span><span>خارجي ↗</span></a>
    ) : <span className="text-xs text-slate-400">داخلي</span> },
    { key: 'playersCount', label: 'اللاعبون', render: v => <span className="text-slate-300">{Number(v).toLocaleString('ar')}</span> },
    { key: 'isComingSoon', label: 'الحالة', render: (_, row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs ${row.isComingSoon ? 'bg-yellow-500/20 text-yellow-400' : row.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
        {row.isComingSoon ? 'قريباً' : row.isActive ? 'نشط' : 'مخفي'}
      </span>
    )},
  ]

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true) }
  const openEdit = (game: Game) => { setForm({ ...game }); setEditId(game._id ?? null); setModalOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const url = editId ? `/api/games/${editId}` : '/api/games'
    const method = editId ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) {
      showToast(editId ? 'تم تحديث اللعبة' : 'تم إنشاء اللعبة')
      setModalOpen(false)
      loadGames()
    } else {
      showToast('خطأ: ' + data.error)
    }
    setSaving(false)
  }

  const handleDelete = async (game: Game) => {
    await fetch(`/api/games/${game._id}`, { method: 'DELETE' })
    showToast('تم حذف اللعبة')
    loadGames()
  }

  const handleToggleActive = async (game: Game) => {
    await fetch(`/api/games/${game._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !game.isActive }),
    })
    loadGames()
  }

  const upd = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <AdminShell
      title="إدارة الألعاب"
      subtitle={`${games.length} لعبة`}
      actions={
        <button onClick={openCreate} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2">
          <span>+</span><span>إضافة لعبة</span>
        </button>
      }
    >
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-xl text-sm shadow-lg">
          {toast}
        </div>
      )}

      <DataTable
        data={games}
        columns={columns}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onReorder={reorder}
        loading={loading}
        emptyMessage="لا توجد ألعاب — أضف أول لعبة"
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'تعديل اللعبة' : 'إضافة لعبة جديدة'} size="lg">
        <div className="space-y-4" dir="rtl">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="العنوان" required>
              <Input value={form.title} onChange={e => upd('title', e.target.value)} placeholder="اسم اللعبة" />
            </FormField>
            <FormField label="الأيقونة (إيموجي)">
              <Input value={form.icon} onChange={e => upd('icon', e.target.value)} placeholder="🎮" />
            </FormField>
          </div>
          <FormField label="الوصف" required>
            <Textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={2} placeholder="وصف مختصر للعبة" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="الفئة" required>
              <Select value={form.category} onChange={e => upd('category', e.target.value)} options={CATEGORIES} />
            </FormField>
            <FormField label="المستوى">
              <Select value={form.difficulty} onChange={e => upd('difficulty', e.target.value)} options={DIFFICULTIES} />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="اللون (Hex)">
              <div className="flex gap-2">
                <input type="color" value={form.color} onChange={e => upd('color', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                <Input value={form.color} onChange={e => upd('color', e.target.value)} />
              </div>
            </FormField>
            <FormField label="النجوم (0-5)">
              <Input type="number" min={0} max={5} value={form.stars} onChange={e => upd('stars', +e.target.value)} />
            </FormField>
            <FormField label="الترتيب">
              <Input type="number" min={0} value={form.order} onChange={e => upd('order', +e.target.value)} />
            </FormField>
          </div>
          <div className="border border-white/10 rounded-xl p-4 space-y-3">
            <Toggle checked={form.isExternalLink} onChange={v => upd('isExternalLink', v)} label="رابط خارجي (يفتح موقع آخر)" />
            {form.isExternalLink && (
              <FormField label="رابط موقع اللعبة الخارجي" hint="مثال: https://www.coolmathgames.com/game">
                <Input value={form.externalLink ?? ''} onChange={e => upd('externalLink', e.target.value)} placeholder="https://..." />
              </FormField>
            )}
          </div>
          <div className="flex gap-6">
            <Toggle checked={form.isActive} onChange={v => upd('isActive', v)} label="نشط" />
            <Toggle checked={form.isComingSoon} onChange={v => upd('isComingSoon', v)} label="قريباً" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2.5 font-medium transition disabled:opacity-60">
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إنشاء اللعبة'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 transition">
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  )
}
