'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ADHKAR_CATEGORIES, type AdhkarCategory } from '@/lib/data/adhkar'

export default function AdhkarSection() {
  const ref = useRef<HTMLElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [selected, setSelected] = useState<AdhkarCategory | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

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

  const openCategory = (cat: AdhkarCategory) => {
    setSelected(cat)
    setActiveIdx(0)
  }

  return (
    <section ref={ref} className="py-20 px-4 bg-black/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-green-400/30 rounded-2xl px-6 py-3 mb-6">
            <span className="text-3xl">🤲</span>
            <span className="text-green-300 font-bold text-lg">الأذكار</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            أذكار المسلم
          </h2>
          <p className="text-green-200 text-lg max-w-xl mx-auto">
            اضغط على قسم لعرض الأذكار المأثورة
          </p>
        </motion.div>

        {/* Category Cards */}
        {!loaded ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ADHKAR_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => openCategory(cat)}
                className="group relative overflow-hidden rounded-3xl p-6 text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/20 rounded-3xl group-hover:border-white/40 transition-all" />

                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${cat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{cat.icon}</span>
                  </div>
                  <h3 className="text-white font-black text-2xl mb-2">{cat.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-green-300 text-sm">{cat.items.length} ذكر</span>
                    <div className="flex items-center gap-1 text-green-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>عرض</span>
                      <span>←</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Adhkar Modal */}
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
              className="bg-gradient-to-b from-emerald-950 to-teal-950 border border-green-500/40 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-green-900/60"
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${selected.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl">{selected.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl">{selected.title}</h3>
                    <p className="text-green-400 text-sm">{selected.items.length} ذكر</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Dhikr Counter Tabs */}
              <div className="flex gap-1.5 px-6 py-3 overflow-x-auto border-b border-white/10 shrink-0 scrollbar-none">
                {selected.items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`shrink-0 w-8 h-8 rounded-full text-sm font-bold transition-all ${
                      activeIdx === idx
                        ? 'bg-green-500 text-white scale-110'
                        : 'bg-white/10 text-green-300 hover:bg-white/20'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Active Dhikr */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Dhikr Text */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5">
                      <p className="text-white text-2xl leading-loose font-bold text-right">
                        {selected.items[activeIdx].text}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-1 gap-3">
                      {selected.items[activeIdx].count && (
                        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                          <span className="text-2xl">🔢</span>
                          <div>
                            <p className="text-green-300 text-xs mb-0.5">التكرار</p>
                            <p className="text-white font-bold">{selected.items[activeIdx].count}</p>
                          </div>
                        </div>
                      )}
                      {selected.items[activeIdx].source && (
                        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                          <span className="text-2xl">📚</span>
                          <div>
                            <p className="text-amber-300 text-xs mb-0.5">المصدر</p>
                            <p className="text-white font-bold">{selected.items[activeIdx].source}</p>
                          </div>
                        </div>
                      )}
                      {selected.items[activeIdx].meaning && (
                        <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3">
                          <span className="text-2xl">✨</span>
                          <div>
                            <p className="text-purple-300 text-xs mb-0.5">الفضل</p>
                            <p className="text-white font-bold">{selected.items[activeIdx].meaning}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 shrink-0">
                <button
                  onClick={() => setActiveIdx(p => Math.max(0, p - 1))}
                  disabled={activeIdx === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition text-sm font-medium"
                >
                  <span>→</span>
                  <span>السابق</span>
                </button>

                <span className="text-green-400 text-sm font-bold">
                  {activeIdx + 1} / {selected.items.length}
                </span>

                <button
                  onClick={() => setActiveIdx(p => Math.min(selected.items.length - 1, p + 1))}
                  disabled={activeIdx === selected.items.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition text-sm font-medium"
                >
                  <span>التالي</span>
                  <span>←</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
