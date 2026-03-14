'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { JUZ_AMMA, parseVerses, type Surah } from '@/lib/data/quran'

export default function JuzAmmaSection() {
  const ref = useRef<HTMLElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [selected, setSelected] = useState<Surah | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLoaded(true); obs.disconnect() } },
      { rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const verses = selected ? parseVerses(selected.text) : []

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-green-400/30 rounded-2xl px-6 py-3 mb-6">
            <span className="text-3xl">📖</span>
            <span className="text-green-300 font-bold text-lg">جزء عمّ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            سور جزء عمّ
          </h2>
          <p className="text-green-200 text-lg max-w-xl mx-auto">
            اضغط على أي سورة لقراءة آياتها الكريمة
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-green-300">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span>٣٧ سورة · من سورة النبأ إلى سورة الناس</span>
          </div>
        </motion.div>

        {/* Surah Grid */}
        {!loaded ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {JUZ_AMMA.map((surah, i) => (
              <motion.button
                key={surah.number}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                onClick={() => setSelected(surah)}
                className="group relative bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-green-400/60 rounded-2xl p-4 text-right transition-all duration-200 hover:shadow-lg hover:shadow-green-900/40 hover:-translate-y-0.5"
              >
                {/* Surah number badge */}
                <div className="absolute top-2.5 left-2.5 w-7 h-7 bg-green-500/80 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{surah.number}</span>
                </div>

                {/* Type badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    surah.type === 'مكية'
                      ? 'bg-amber-500/30 text-amber-200'
                      : 'bg-blue-500/30 text-blue-200'
                  }`}>
                    {surah.type}
                  </span>
                </div>

                <div className="mt-8">
                  <p className="text-white font-black text-lg leading-snug mb-1">
                    {surah.name}
                  </p>
                  <p className="text-green-300 text-xs">
                    {surah.ayahs} آية
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 text-green-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>اقرأ</span>
                  <span>←</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Surah Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-gradient-to-b from-emerald-950 to-teal-950 border border-green-500/40 rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl shadow-green-900/60"
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{selected.number}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl">سورة {selected.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selected.type === 'مكية' ? 'bg-amber-500/30 text-amber-300' : 'bg-blue-500/30 text-blue-300'
                      }`}>
                        {selected.type}
                      </span>
                      <span className="text-green-400 text-xs">{selected.ayahs} آية</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 px-6 py-6">
                {/* Bismillah */}
                <div className="text-center mb-8">
                  <p className="text-green-200 text-2xl font-bold leading-loose tracking-wide">
                    بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                  </p>
                  <div className="mt-3 w-32 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto" />
                </div>

                {/* Verses */}
                <div className="space-y-4">
                  {verses.map(({ verse, num }) => (
                    <div
                      key={num}
                      className="flex items-start gap-3 group"
                    >
                      <div className="shrink-0 w-8 h-8 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mt-1">
                        <span className="text-green-300 text-xs font-bold">{num}</span>
                      </div>
                      <p className="text-white text-xl leading-loose flex-1 text-right font-medium">
                        {verse}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-10 text-center">
                  <div className="inline-flex items-center gap-2 text-green-400 text-sm">
                    <span>صَدَقَ اللَّهُ الْعَظِيمُ</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
