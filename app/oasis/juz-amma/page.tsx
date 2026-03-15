'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { JUZ_AMMA, parseVerses, type Surah } from '@/lib/data/quran'

/* ── Audio URL helper ───────────────────────────────────────── */
const audioUrl = (num: number) =>
  `/audio/juz-amma/${String(num).padStart(3, '0')}.mp3`

/* ── Verse number badge ─────────────────────────────────────── */
function VNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-black text-emerald-950 bg-amber-400 rounded-full mx-1 border border-amber-300 align-middle select-none shrink-0">
      {n}
    </span>
  )
}

/* ── Sound wave bars (animated) ─────────────────────────────── */
function SoundWave({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-6">
      {[1, 1.6, 0.8, 1.4, 0.6, 1.2, 1.8, 0.9, 1.5, 0.7].map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-amber-400"
          animate={playing
            ? { scaleY: [1, h * 1.4, 0.5, h, 1], opacity: [0.7, 1, 0.6, 1, 0.7] }
            : { scaleY: 0.3, opacity: 0.35 }}
          transition={playing
            ? { duration: 0.7 + i * 0.07, repeat: Infinity, ease: 'easeInOut', delay: i * 0.06 }
            : { duration: 0.3 }}
          style={{ height: '100%', originY: 0.5 }}
        />
      ))}
    </div>
  )
}

/* ── Audio Player ───────────────────────────────────────────── */
function AudioPlayer({ surah }: { surah: Surah }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(true)

  // Reset when surah changes
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.pause()
    a.currentTime = 0
    setPlaying(false)
    setCurrent(0)
    setDuration(0)
    setLoading(true)
  }, [surah.number])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play(); setPlaying(true) }
  }, [playing])

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current
    if (!a || !duration) return
    const t = (Number(e.target.value) / 100) * duration
    a.currentTime = t
    setCurrent(t)
  }

  const pct = duration ? (current / duration) * 100 : 0

  return (
    <div className="my-8">
      <audio
        ref={audioRef}
        src={audioUrl(surah.number)}
        onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
        onDurationChange={e => { setDuration(e.currentTarget.duration); setLoading(false) }}
        onEnded={() => { setPlaying(false); setCurrent(0) }}
        onCanPlay={() => setLoading(false)}
        preload="metadata"
      />

      <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-emerald-950/80 to-teal-950/80 backdrop-blur-xl p-6 shadow-2xl shadow-amber-900/20">

        {/* Decorative glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xl">
              🎧
            </div>
            <div>
              <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">استمع للتلاوة</p>
              <p className="text-white font-black text-base">سورة {surah.name}</p>
            </div>
          </div>
          <SoundWave playing={playing} />
        </div>

        {/* Play button + time */}
        <div className="relative flex items-center gap-5">

          {/* Play / Pause */}
          <motion.button
            onClick={toggle}
            disabled={loading}
            whileTap={{ scale: 0.92 }}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40 flex items-center justify-center text-white disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
            ) : playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <rect x="6" y="4" width="4" height="16" rx="2" />
                <rect x="14" y="4" width="4" height="16" rx="2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 mr-[-2px]">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            )}

            {/* Ripple when playing */}
            {playing && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-amber-400"
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </motion.button>

          {/* Progress + time */}
          <div className="flex-1 space-y-2">
            {/* Seekbar */}
            <div className="relative h-3 group">
              <div className="absolute inset-y-0 w-full flex items-center">
                <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-100"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <input
                type="range" min="0" max="100" value={pct}
                onChange={seek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              />
            </div>

            {/* Times */}
            <div className="flex justify-between text-xs font-mono">
              <span className="text-amber-300">{fmt(current)}</span>
              <span className="text-white/40">{fmt(duration)}</span>
            </div>
          </div>
        </div>

        {/* Kids tip */}
        <div className="relative mt-4 flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-2.5">
          <span className="text-lg">🌟</span>
          <p className="text-white/60 text-xs">استمع للتلاوة وتابع الكلمات أثناء القراءة</p>
        </div>
      </div>
    </div>
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
            <button onClick={onPrev} disabled={!hasPrev} title="السورة السابقة"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed text-white flex items-center justify-center transition text-sm">←</button>
            <button onClick={onNext} disabled={!hasNext} title="السورة التالية"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed text-white flex items-center justify-center transition text-sm">→</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Surah name plate */}
        <div className="text-center mb-8">
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

        {/* Audio Player */}
        <AudioPlayer surah={surah} />

        {/* Ornament */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
          <span className="text-amber-400/60 text-2xl">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>

        {/* Bismillah */}
        <p className="text-center text-amber-300 text-3xl font-bold leading-loose mb-8"
          style={{ fontFamily: 'var(--font-amiri-quran), serif' }}>
          بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
        </p>

        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
          <span className="text-amber-400/50 text-xl">❖</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        </div>

        {/* Flowing verses */}
        <div className="bg-gradient-to-br from-black/30 to-black/10 border border-white/10 rounded-3xl p-6 md:p-10">
          <p className="text-white text-[1.55rem] leading-[4rem] text-right" dir="rtl"
            style={{ fontFamily: 'var(--font-amiri-quran), serif' }}>
            {verses.map(({ verse, num }) => (
              <span key={num}>{verse}{' '}<VNum n={num} />{' '}</span>
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
          <button onClick={onPrev} disabled={!hasPrev}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl transition font-bold text-sm">
            <span>→</span>
            {hasPrev ? <span>سورة {JUZ_AMMA[idx - 1].name}</span> : <span>السابقة</span>}
          </button>
          <span className="text-green-400 text-sm font-bold">{idx + 1} / {JUZ_AMMA.length}</span>
          <button onClick={onNext} disabled={!hasNext}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl transition font-bold text-sm">
            {hasNext ? <span>سورة {JUZ_AMMA[idx + 1].name}</span> : <span>التالية</span>}
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
    <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-5 py-2 mb-6">
            <span className="text-amber-400 text-sm font-bold">الجزء الثلاثون</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">📖 جزء عمّ</h1>
          <p className="text-green-200 text-lg">٣٧ سورة — من سورة النبأ إلى سورة الناس</p>
          <p className="text-green-400/70 text-sm mt-2">اضغط على أي سورة للقراءة والاستماع</p>
        </div>
      </section>

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
              <div className="absolute top-2.5 left-2.5 w-7 h-7 bg-amber-400/20 border border-amber-400/40 rounded-full flex items-center justify-center">
                <span className="text-amber-300 text-xs font-black">{surah.number}</span>
              </div>

              {/* Audio indicator */}
              <div className="absolute top-2.5 right-8">
                <span className="text-green-400/50 group-hover:text-green-400 transition text-sm">🎧</span>
              </div>

              <div className="absolute top-2.5 right-2.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  surah.type === 'مكية' ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                }`}>{surah.type}</span>
              </div>

              <div className="mt-7">
                <p className="text-white font-black text-xl leading-tight">{surah.name}</p>
                <p className="text-green-400 text-xs mt-1">{surah.ayahs} آية</p>
              </div>

              <div className="mt-3 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent group-hover:via-amber-400/60 transition-all" />

              <p className="mt-2 text-amber-400/0 group-hover:text-amber-400/80 text-xs font-bold transition-all">
                اقرأ واستمع ←
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
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950" dir="rtl">
      <Navbar />
      <div className="px-4 pt-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/oasis" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition text-sm font-bold">
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
