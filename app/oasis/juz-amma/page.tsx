'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { JUZ_AMMA, parseVerses, type Surah } from '@/lib/data/quran'

/* ── Verse number badge ─────────────────────────────────────── */
function VNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-black text-emerald-950 bg-amber-400 rounded-full mx-1 border border-amber-300 align-middle select-none shrink-0">
      {n}
    </span>
  )
}

/* ── Full surah reader ──────────────────────────────────────── */
function Reader({
  idx, onBack, onPrev, onNext,
}: {
  idx: number; onBack: () => void; onPrev: () => void; onNext: () => void
}) {
  const surah = JUZ_AMMA[idx]
  const verses = parseVerses(surah.text)
  const hasPrev = idx > 0
  const hasNext = idx < JUZ_AMMA.length - 1

  return (
    <motion.div
      key={surah.number}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen"
    >
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-green-300 hover:text-white transition text-sm font-bold whitespace-nowrap"
          >
            <span className="text-lg leading-none">→</span>
            <span>السور</span>
          </button>

          <div className="text-center flex-1 min-w-0">
            <h1 className="text-white font-black text-lg truncate">سورة {surah.name}</h1>
            <div className="flex items-center justify-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                surah.type === 'مكية' ? 'bg-amber-500/30 text-amber-300' : 'bg-sky-500/30 text-sky-300'
              }`}>{surah.type}</span>
              <span className="text-green-400 text-xs">{surah.ayahs} آية</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/40 text-xs">{surah.number}</span>
            </div>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              title="السورة السابقة"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed text-white flex items-center justify-center transition text-sm"
            >←</button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              title="السورة التالية"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed text-white flex items-center justify-center transition text-sm"
            >→</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Surah name plate */}
        <div className="text-center mb-10">
          <div className="inline-block relative">
            <div className="absolute -inset-3 border border-amber-400/30 rounded-2xl" />
            <div className="absolute -inset-5 border border-amber-400/10 rounded-3xl" />
            <div className="relative px-10 py-4">
              <p className="text-amber-300 text-4xl font-black mb-1" style={{ fontFamily: 'var(--font-amiri-quran), serif' }}>سورة {surah.name}</p>
              <div className="flex items-center justify-center gap-3 text-sm">
                <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                  surah.type === 'مكية' ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                }`}>{surah.type}</span>
                <span className="text-white/50">·</span>
                <span className="text-green-300">{surah.ayahs} آية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ornament */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <span className="text-amber-400/60 text-2xl">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>

        {/* Bismillah */}
        <p
          className="text-center text-amber-300 text-3xl font-bold leading-loose mb-8"
          style={{ fontFamily: 'var(--font-amiri-quran), serif' }}
        >
          بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
        </p>

        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
          <span className="text-amber-400/50 text-xl">❖</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        </div>

        {/* Flowing verses */}
        <div className="bg-gradient-to-br from-black/30 to-black/10 border border-white/10 rounded-3xl p-6 md:p-10">
          <p
            className="text-white text-[1.55rem] leading-[4rem] text-right"
            dir="rtl"
            style={{ fontFamily: 'var(--font-amiri-quran), serif' }}
          >
            {verses.map(({ verse, num }) => (
              <span key={num}>
                {verse}{' '}<VNum n={num} />{' '}
              </span>
            ))}
          </p>
        </div>

        {/* صدق الله */}
        <div className="flex items-center gap-3 mt-10 mb-4 justify-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
          <p className="text-amber-400/80 text-lg font-bold">صَدَقَ اللَّهُ الْعَظِيمُ</p>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between mt-10 gap-4">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl transition font-bold text-sm"
          >
            <span>→</span>
            {hasPrev && <span>سورة {JUZ_AMMA[idx - 1].name}</span>}
            {!hasPrev && <span>السابقة</span>}
          </button>

          <span className="text-green-400 text-sm font-bold">
            {idx + 1} / {JUZ_AMMA.length}
          </span>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl transition font-bold text-sm"
          >
            {hasNext && <span>سورة {JUZ_AMMA[idx + 1].name}</span>}
            {!hasNext && <span>التالية</span>}
            <span>←</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Surah grid ─────────────────────────────────────────────── */
function Grid({ onSelect }: { onSelect: (i: number) => void }) {
  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-5 py-2 mb-6">
            <span className="text-amber-400 text-sm font-bold">الجزء الثلاثون</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            📖 جزء عمّ
          </h1>
          <p className="text-green-200 text-lg">
            ٣٧ سورة — من سورة النبأ إلى سورة الناس
          </p>
          <p className="text-green-400/70 text-sm mt-2">اضغط على أي سورة لبدء القراءة</p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {JUZ_AMMA.map((surah, i) => (
            <motion.button
              key={surah.number}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.025 }}
              onClick={() => onSelect(i)}
              className="group relative bg-white/5 hover:bg-white/15 border border-white/10 hover:border-amber-400/50 rounded-2xl p-4 text-right transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-900/20"
            >
              {/* Number badge */}
              <div className="absolute top-2.5 left-2.5 w-7 h-7 bg-amber-400/20 border border-amber-400/40 rounded-full flex items-center justify-center">
                <span className="text-amber-300 text-xs font-black">{surah.number}</span>
              </div>

              {/* Type pill */}
              <div className="absolute top-2.5 right-2.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  surah.type === 'مكية'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-sky-500/20 text-sky-300'
                }`}>{surah.type}</span>
              </div>

              <div className="mt-7">
                <p className="text-white font-black text-xl leading-tight">{surah.name}</p>
                <p className="text-green-400 text-xs mt-1">{surah.ayahs} آية</p>
              </div>

              <div className="mt-3 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent group-hover:via-amber-400/60 transition-all" />

              <p className="mt-2 text-amber-400/0 group-hover:text-amber-400/80 text-xs font-bold transition-all">
                اقرأ الآن ←
              </p>
            </motion.button>
          ))}
        </div>
      </section>
    </motion.div>
  )
}

/* ── Page ───────────────────────────────────────────────────── */
export default function JuzAmmaPage() {
  const [idx, setIdx] = useState<number | null>(null)

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950"
      dir="rtl"
    >
      <Navbar />

      {/* Back to oasis */}
      <div className="px-4 pt-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/oasis"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition text-sm font-bold"
          >
            <span>→</span><span>العودة لواحة نور</span>
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {idx === null ? (
          <Grid key="grid" onSelect={setIdx} />
        ) : (
          <Reader
            key="reader"
            idx={idx}
            onBack={() => setIdx(null)}
            onPrev={() => setIdx(p => Math.max(0, (p ?? 0) - 1))}
            onNext={() => setIdx(p => Math.min(JUZ_AMMA.length - 1, (p ?? 0) + 1))}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
