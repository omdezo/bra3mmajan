'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import Modal from '@/components/admin/Modal'
import { FormField, Input, Textarea, Select, Toggle } from '@/components/admin/FormField'

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Question {
  _id?: string
  question: string
  options: [string, string, string, string]
  correctAnswer: 0 | 1 | 2 | 3
  points: number
  timeLimit: number
  hint?: string
}

interface Challenge {
  _id?: string
  title: string
  description: string
  category: string
  icon: string
  color: string
  difficulty: string
  allowedModes: string[]
  questions: Question[]
  basePoints: number
  defaultTimeLimit: number
  speedBonus: boolean
  isActive: boolean
  isComingSoon: boolean
  isFeatured: boolean
  participantsCount: number
  order: number
}

/* ─── Constants ─────────────────────────────────────────────────────── */
const EMPTY_CHALLENGE: Omit<Challenge, '_id'> = {
  title: '', description: '', category: 'معلومات عامة', icon: '🏆', color: '#F59E0B',
  difficulty: 'سهل', allowedModes: ['solo', '1v1'], questions: [],
  basePoints: 100, defaultTimeLimit: 20, speedBonus: true,
  isActive: true, isComingSoon: false, isFeatured: false, participantsCount: 0, order: 0,
}

const EMPTY_QUESTION = (): Question => ({
  question: '', options: ['', '', '', ''], correctAnswer: 0, points: 100, timeLimit: 20, hint: '',
})

const CATEGORIES = ['معلومات عامة', 'تحديات أسبوعية', 'منافسة الأصدقاء', 'اختبارات ذاتية'].map(v => ({ value: v, label: v }))
const DIFFICULTIES = ['سهل', 'متوسط', 'صعب'].map(v => ({ value: v, label: v }))
const MODES = [
  { key: 'solo', label: 'فردي', icon: '👤' },
  { key: '1v1', label: '١ ضد ١', icon: '⚔️' },
  { key: '2v2', label: '٢ ضد ٢', icon: '👥' },
  { key: '4v4', label: '٤ ضد ٤', icon: '🏟️' },
]
const DIFF_COLOR: Record<string, string> = {
  'سهل': 'bg-green-500/20 text-green-400',
  'متوسط': 'bg-yellow-500/20 text-yellow-400',
  'صعب': 'bg-red-500/20 text-red-400',
}
const OPTION_LABELS = ['أ', 'ب', 'ج', 'د']
const OPTION_COLORS = [
  'border-blue-500/40 bg-blue-500/10',
  'border-pink-500/40 bg-pink-500/10',
  'border-amber-500/40 bg-amber-500/10',
  'border-green-500/40 bg-green-500/10',
]

/* ─── Component ─────────────────────────────────────────────────────── */
export default function ChallengesAdminPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  // Challenge modal
  const [cModal, setCModal] = useState(false)
  const [cForm, setCForm] = useState<Omit<Challenge, '_id'>>(EMPTY_CHALLENGE)
  const [cEditId, setCEditId] = useState<string | null>(null)
  const [cSaving, setCSaving] = useState(false)

  // Question management: open one challenge's question editor
  const [qChallenge, setQChallenge] = useState<Challenge | null>(null)
  const [qModal, setQModal] = useState(false)
  const [qForm, setQForm] = useState<Question>(EMPTY_QUESTION())
  const [qEditIdx, setQEditIdx] = useState<number | null>(null)
  const [qSaving, setQSaving] = useState(false)

  const toast$ = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/challenges?active=false&limit=100')
    const d = await res.json()
    if (d.success) setChallenges(d.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  /* ── Challenge CRUD ── */
  const openCreateChallenge = () => { setCForm(EMPTY_CHALLENGE); setCEditId(null); setCModal(true) }
  const openEditChallenge = (c: Challenge) => {
    setCForm({ ...c, questions: c.questions ?? [] })
    setCEditId(c._id ?? null)
    setCModal(true)
  }

  const saveChallenge = async () => {
    setCSaving(true)
    const url = cEditId ? `/api/challenges/${cEditId}` : '/api/challenges'
    const res = await fetch(url, {
      method: cEditId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cForm),
    })
    const d = await res.json()
    if (d.success) { toast$(cEditId ? 'تم تحديث التحدي' : 'تم إنشاء التحدي'); setCModal(false); load() }
    else toast$('خطأ: ' + d.error)
    setCSaving(false)
  }

  const deleteChallenge = async (c: Challenge) => {
    if (!confirm('حذف هذا التحدي وجميع أسئلته؟')) return
    await fetch(`/api/challenges/${c._id}`, { method: 'DELETE' })
    toast$('تم الحذف'); load()
  }

  const toggleMode = (mode: string) => {
    setCForm(f => ({
      ...f,
      allowedModes: f.allowedModes.includes(mode)
        ? f.allowedModes.filter(m => m !== mode)
        : [...f.allowedModes, mode],
    }))
  }

  const updC = (k: keyof typeof cForm, v: unknown) => setCForm(f => ({ ...f, [k]: v }))

  /* ── Question CRUD ── */
  const openQManager = (c: Challenge) => { setQChallenge({ ...c }); setQModal(false); setQForm(EMPTY_QUESTION()); setQEditIdx(null) }

  const openAddQuestion = () => { setQForm(EMPTY_QUESTION()); setQEditIdx(null); setQModal(true) }
  const openEditQuestion = (q: Question, idx: number) => { setQForm({ ...q }); setQEditIdx(idx); setQModal(true) }

  const saveQuestion = async () => {
    if (!qChallenge) return
    if (!qForm.question.trim()) return toast$('اكتب نص السؤال')
    if (qForm.options.some(o => !o.trim())) return toast$('اكتب جميع الخيارات الأربعة')
    setQSaving(true)

    // Build updated questions array
    const updatedQuestions = [...(qChallenge.questions ?? [])]
    if (qEditIdx !== null) {
      updatedQuestions[qEditIdx] = qForm
    } else {
      updatedQuestions.push(qForm)
    }

    const res = await fetch(`/api/challenges/${qChallenge._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: updatedQuestions }),
    })
    const d = await res.json()
    if (d.success) {
      toast$(qEditIdx !== null ? 'تم تحديث السؤال' : 'تم إضافة السؤال')
      setQChallenge({ ...qChallenge, questions: updatedQuestions })
      setQModal(false)
      load()
    } else {
      toast$('خطأ: ' + d.error)
    }
    setQSaving(false)
  }

  const deleteQuestion = async (idx: number) => {
    if (!qChallenge) return
    if (!confirm('حذف هذا السؤال؟')) return
    const updatedQuestions = qChallenge.questions.filter((_, i) => i !== idx)
    const res = await fetch(`/api/challenges/${qChallenge._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions: updatedQuestions }),
    })
    const d = await res.json()
    if (d.success) {
      toast$('تم حذف السؤال')
      setQChallenge({ ...qChallenge, questions: updatedQuestions })
      load()
    }
  }

  const updOption = (idx: number, v: string) => {
    const opts = [...qForm.options] as [string, string, string, string]
    opts[idx] = v
    setQForm(f => ({ ...f, options: opts }))
  }

  const updQ = (k: keyof Question, v: unknown) => setQForm(f => ({ ...f, [k]: v }))

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <AdminShell
      title="إدارة التحديات"
      subtitle={qChallenge ? `أسئلة: ${qChallenge.title}` : `${challenges.length} تحدٍ`}
      actions={
        qChallenge ? (
          <div className="flex gap-2">
            <button onClick={openAddQuestion} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2">
              <span>+</span><span>إضافة سؤال</span>
            </button>
            <button onClick={() => setQChallenge(null)} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm transition">
              ← العودة
            </button>
          </div>
        ) : (
          <button onClick={openCreateChallenge} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2">
            <span>+</span><span>إضافة تحدي</span>
          </button>
        )
      }
    >
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-xl text-sm shadow-lg">
          {toast}
        </div>
      )}

      {/* ── Question Manager View ── */}
      {qChallenge ? (
        <div className="space-y-4">
          {/* Challenge summary */}
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <span className="text-4xl">{qChallenge.icon}</span>
            <div>
              <div className="font-semibold text-white">{qChallenge.title}</div>
              <div className="text-xs text-slate-400">{qChallenge.questions?.length ?? 0} سؤال · {qChallenge.basePoints} نقطة · {qChallenge.defaultTimeLimit}ث/سؤال</div>
            </div>
            <div className="mr-auto flex gap-2">
              {qChallenge.allowedModes?.map(m => (
                <span key={m} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">{MODES.find(x => x.key === m)?.label}</span>
              ))}
            </div>
          </div>

          {/* Questions list */}
          {(!qChallenge.questions || qChallenge.questions.length === 0) ? (
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">❓</div>
              <div>لا توجد أسئلة بعد — أضف أول سؤال</div>
            </div>
          ) : (
            <div className="space-y-3">
              {qChallenge.questions.map((q, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-3">{q.question}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => (
                          <div
                            key={oi}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                              oi === q.correctAnswer
                                ? 'border-green-500/50 bg-green-500/10 text-green-300'
                                : 'border-white/5 text-slate-400'
                            }`}
                          >
                            <span className="font-bold">{OPTION_LABELS[oi]}</span>
                            <span className="truncate">{opt}</span>
                            {oi === q.correctAnswer && <span className="mr-auto text-green-400">✓</span>}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>⏱ {q.timeLimit}ث</span>
                        <span>⭐ {q.points} نقطة</span>
                        {q.hint && <span>💡 {q.hint}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEditQuestion(q, idx)} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center text-xs">✏️</button>
                      <button onClick={() => deleteQuestion(idx)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-xs">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Challenges Table ── */
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400">جاري التحميل...</div>
          ) : challenges.length === 0 ? (
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">🏆</div><div>لا توجد تحديات — أضف تحدياً جديداً</div>
            </div>
          ) : (
            <div className="space-y-3">
              {challenges.map(c => (
                <div key={c._id} className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition group">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{c.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white">{c.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${DIFF_COLOR[c.difficulty]}`}>{c.difficulty}</span>
                        {c.isFeatured && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">⭐ مميز</span>}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${c.isComingSoon ? 'bg-yellow-500/20 text-yellow-400' : c.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          {c.isComingSoon ? 'قريباً' : c.isActive ? 'نشط' : 'مخفي'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                        <span>❓ {c.questions?.length ?? 0} سؤال</span>
                        <span>⭐ {c.basePoints} نقطة</span>
                        <span>⏱ {c.defaultTimeLimit}ث</span>
                        <span>👥 {c.participantsCount} مشارك</span>
                        <div className="flex gap-1">
                          {(c.allowedModes ?? []).map(m => (
                            <span key={m} className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                              {MODES.find(x => x.key === m)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => openQManager(c)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg text-xs font-medium transition"
                        title="إدارة الأسئلة"
                      >
                        ❓ أسئلة
                      </button>
                      <button onClick={() => openEditChallenge(c)} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center text-xs">✏️</button>
                      <button onClick={() => deleteChallenge(c)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-xs">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Challenge Form Modal ── */}
      <Modal isOpen={cModal} onClose={() => setCModal(false)} title={cEditId ? 'تعديل التحدي' : 'إنشاء تحدي جديد'} size="xl">
        <div className="space-y-4" dir="rtl">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="عنوان التحدي" required>
              <Input value={cForm.title} onChange={e => updC('title', e.target.value)} placeholder="مثال: تحدي العلوم" />
            </FormField>
            <FormField label="الفئة">
              <Select value={cForm.category} onChange={e => updC('category', e.target.value)} options={CATEGORIES} />
            </FormField>
          </div>
          <FormField label="الوصف" required>
            <Textarea value={cForm.description} onChange={e => updC('description', e.target.value)} rows={2} />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="الأيقونة">
              <Input value={cForm.icon} onChange={e => updC('icon', e.target.value)} placeholder="🏆" />
            </FormField>
            <FormField label="المستوى">
              <Select value={cForm.difficulty} onChange={e => updC('difficulty', e.target.value)} options={DIFFICULTIES} />
            </FormField>
            <FormField label="الترتيب">
              <Input type="number" min={0} value={cForm.order} onChange={e => updC('order', +e.target.value)} />
            </FormField>
          </div>

          {/* Points & timing */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="النقاط الأساسية للسؤال" hint="يُضاعف حسب السرعة">
              <Input type="number" min={10} max={1000} value={cForm.basePoints} onChange={e => updC('basePoints', +e.target.value)} />
            </FormField>
            <FormField label="الوقت الافتراضي للسؤال (ثانية)">
              <Input type="number" min={5} max={60} value={cForm.defaultTimeLimit} onChange={e => updC('defaultTimeLimit', +e.target.value)} />
            </FormField>
          </div>

          {/* Game modes */}
          <FormField label="أوضاع اللعب المتاحة">
            <div className="flex flex-wrap gap-2 mt-1">
              {MODES.map(m => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => toggleMode(m.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                    cForm.allowedModes.includes(m.key)
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span>{m.icon}</span><span>{m.label}</span>
                </button>
              ))}
            </div>
          </FormField>

          <div className="flex gap-6 flex-wrap">
            <Toggle checked={cForm.speedBonus} onChange={v => updC('speedBonus', v)} label="مكافأة السرعة (نقاط إضافية)" />
            <Toggle checked={cForm.isActive} onChange={v => updC('isActive', v)} label="نشط" />
            <Toggle checked={cForm.isComingSoon} onChange={v => updC('isComingSoon', v)} label="قريباً" />
            <Toggle checked={cForm.isFeatured} onChange={v => updC('isFeatured', v)} label="مميز" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={saveChallenge} disabled={cSaving} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-2.5 font-medium transition disabled:opacity-60">
              {cSaving ? 'جاري الحفظ...' : cEditId ? 'حفظ التعديلات' : 'إنشاء التحدي'}
            </button>
            <button onClick={() => setCModal(false)} className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 transition">إلغاء</button>
          </div>
        </div>
      </Modal>

      {/* ── Question Form Modal ── */}
      <Modal isOpen={qModal} onClose={() => setQModal(false)} title={qEditIdx !== null ? 'تعديل السؤال' : 'إضافة سؤال جديد'} size="xl">
        <div className="space-y-5" dir="rtl">
          <FormField label="نص السؤال" required>
            <Textarea
              value={qForm.question}
              onChange={e => updQ('question', e.target.value)}
              rows={3}
              placeholder="اكتب السؤال هنا... مثال: ما عاصمة سلطنة عُمان؟"
              className="text-base"
            />
          </FormField>

          {/* 4 options */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              الخيارات الأربعة <span className="text-xs text-slate-500">(اضغط على الدائرة لتحديد الإجابة الصحيحة)</span>
            </label>
            <div className="space-y-2">
              {qForm.options.map((opt, oi) => (
                <div
                  key={oi}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition cursor-pointer ${
                    qForm.correctAnswer === oi
                      ? 'border-green-500 bg-green-500/10'
                      : OPTION_COLORS[oi]
                  }`}
                  onClick={() => updQ('correctAnswer', oi as 0 | 1 | 2 | 3)}
                >
                  {/* Radio */}
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-bold text-sm transition ${
                    qForm.correctAnswer === oi
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-slate-500 text-slate-400'
                  }`}>
                    {qForm.correctAnswer === oi ? '✓' : OPTION_LABELS[oi]}
                  </div>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => { e.stopPropagation(); updOption(oi, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    placeholder={`الخيار ${OPTION_LABELS[oi]}`}
                    className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-sm"
                  />
                  {qForm.correctAnswer === oi && (
                    <span className="text-xs text-green-400 font-semibold flex-shrink-0">✅ صحيح</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="النقاط لهذا السؤال">
              <Input type="number" min={10} max={1000} step={10} value={qForm.points} onChange={e => updQ('points', +e.target.value)} />
            </FormField>
            <FormField label="الوقت المخصص (ثانية)">
              <Input type="number" min={5} max={60} value={qForm.timeLimit} onChange={e => updQ('timeLimit', +e.target.value)} />
            </FormField>
          </div>

          <FormField label="تلميح (اختياري)" hint="يظهر للاعب إذا طلب مساعدة">
            <Input value={qForm.hint ?? ''} onChange={e => updQ('hint', e.target.value)} placeholder="مثال: تقع في شمال عُمان..." />
          </FormField>

          {/* Preview */}
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2">معاينة السؤال</p>
            <p className="text-white text-sm font-medium mb-2">{qForm.question || 'نص السؤال...'}</p>
            <div className="grid grid-cols-2 gap-1">
              {qForm.options.map((o, oi) => (
                <div key={oi} className={`text-xs px-2 py-1 rounded flex gap-1 ${oi === qForm.correctAnswer ? 'bg-green-500/20 text-green-300' : 'bg-slate-700 text-slate-300'}`}>
                  <span className="font-bold">{OPTION_LABELS[oi]}.</span><span>{o || '---'}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">⏱ {qForm.timeLimit}ث · ⭐ {qForm.points} نقطة</p>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={saveQuestion} disabled={qSaving} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-2.5 font-medium transition disabled:opacity-60">
              {qSaving ? 'جاري الحفظ...' : qEditIdx !== null ? 'حفظ التعديلات' : 'إضافة السؤال'}
            </button>
            <button onClick={() => setQModal(false)} className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 transition">إلغاء</button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  )
}
