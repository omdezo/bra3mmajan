'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { ADHKAR_CATEGORIES, type AdhkarCategory } from '@/lib/data/adhkar'

/* ── Dhikr reader ───────────────────────────────────────────── */
function DhikrReader({
  cat, onBack,
}: {
  cat: AdhkarCategory; onBack: () => void
}) {
  const [idx, setIdx] = useState(0)
  const dhikr = cat.items[idx]
  const hasPrev = idx > 0
  const hasNext = idx < cat.items.length - 1

  return (
    <motion.div
      key={cat.id}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.22 }}
      className="min-h-screen"
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-green-300 hover:text-white transition text-sm font-bold whitespace-nowrap"
          >
            <span className="text-lg leading-none">→</span>
            <span>الأقسام</span>
          </button>

          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">{cat.icon}</span>
              <h1 className="text-white font-black text-lg">{cat.title}</h1>
            </div>
          </div>

          <span className="text-green-400 text-sm font-bold whitespace-nowrap">
            {idx + 1} / {cat.items.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-white/10">
          <motion.div
            className={`h-full bg-gradient-to-r ${cat.gradient}`}
            initial={false}
            animate={{ width: `${((idx + 1) / cat.items.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Dhikr content */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-1.5 mb-8 flex-wrap">
          {cat.items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`rounded-full transition-all duration-200 ${
                i === idx
                  ? 'w-6 h-2.5 bg-green-400'
                  : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            {/* Main dhikr text */}
            <div className="relative mb-6">
              {/* Decorative quotes */}
              <div className="absolute -top-3 right-5 text-green-400/20 text-6xl leading-none font-serif select-none">"</div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10">
                <p
                  className="text-white text-2xl md:text-3xl leading-[2.8rem] text-right font-bold"
                  dir="rtl"
                >
                  {dhikr.text}
                </p>
              </div>
            </div>

            {/* Metadata cards */}
            <div className="grid grid-cols-1 gap-3">
              {dhikr.count && (
                <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">🔁</span>
                  </div>
                  <div>
                    <p className="text-emerald-300 text-xs font-bold mb-0.5">التكرار</p>
                    <p className="text-white font-bold text-lg">{dhikr.count}</p>
                  </div>
                </div>
              )}

              {dhikr.source && (
                <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-4">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <p className="text-amber-300 text-xs font-bold mb-0.5">المصدر</p>
                    <p className="text-white font-bold">{dhikr.source}</p>
                  </div>
                </div>
              )}

              {dhikr.meaning && (
                <div className="flex items-center gap-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl px-5 py-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">✨</span>
                  </div>
                  <div>
                    <p className="text-purple-300 text-xs font-bold mb-0.5">الفضل</p>
                    <p className="text-white font-bold">{dhikr.meaning}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next buttons */}
        <div className="flex items-center justify-between mt-10 gap-4">
          <button
            onClick={() => setIdx(p => p - 1)}
            disabled={!hasPrev}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed text-white rounded-2xl transition font-bold text-sm"
          >
            <span>→</span><span>السابق</span>
          </button>

          <button
            onClick={() => setIdx(p => p + 1)}
            disabled={!hasNext}
            className={`flex items-center gap-2 px-5 py-3 bg-gradient-to-r ${cat.gradient} disabled:opacity-25 disabled:cursor-not-allowed text-white rounded-2xl transition font-bold text-sm hover:opacity-90`}
          >
            <span>التالي</span><span>←</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Category grid ──────────────────────────────────────────── */
function CategoryGrid({ onSelect }: { onSelect: (cat: AdhkarCategory) => void }) {
  return (
    <motion.div
      key="cats"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/30 rounded-full px-5 py-2 mb-6">
            <span className="text-green-400 text-sm font-bold">أذكار المسلم اليومية</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            🤲 الأذكار
          </h1>
          <p className="text-green-200 text-lg">
            أذكار مأثورة من السنة النبوية الشريفة
          </p>
          <p className="text-green-400/70 text-sm mt-2">اختر قسماً للبدء</p>
        </div>
      </section>

      {/* Cards */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ADHKAR_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onSelect(cat)}
              className="group relative overflow-hidden rounded-3xl p-6 text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Gradient glow bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-15 group-hover:opacity-25 transition-opacity`} />
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/15 rounded-3xl group-hover:border-white/30 transition-all" />

              <div className="relative z-10 flex flex-col gap-4">
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{cat.icon}</span>
                </div>

                {/* Title + count */}
                <div>
                  <h3 className="text-white font-black text-2xl mb-1">{cat.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-green-300 text-sm">{cat.items.length} ذكر</span>
                    <span className="text-white/0 group-hover:text-white/70 text-sm font-bold transition-all">
                      ابدأ ←
                    </span>
                  </div>
                </div>

                {/* Preview of first dhikr */}
                <p className="text-white/50 text-sm leading-relaxed line-clamp-2 text-right">
                  {cat.items[0].text.slice(0, 60)}…
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </motion.div>
  )
}

/* ── Page ───────────────────────────────────────────────────── */
export default function AdhkarPage() {
  const [selected, setSelected] = useState<AdhkarCategory | null>(null)

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950"
      dir="rtl"
    >
      <Navbar />

      {/* Back to oasis */}
      <div className="px-4 pt-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/oasis"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition text-sm font-bold"
          >
            <span>→</span><span>العودة لواحة نور</span>
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selected === null ? (
          <CategoryGrid key="cats" onSelect={setSelected} />
        ) : (
          <DhikrReader key={selected.id} cat={selected} onBack={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </main>
  )
}
