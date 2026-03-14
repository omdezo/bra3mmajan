'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  url: string
  title: string
}

export default function PPTViewer({ url, title }: Props) {
  const [engine, setEngine] = useState<'office' | 'google'>('office')
  const [loaded, setLoaded] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const enc = encodeURIComponent(url)
  const src =
    engine === 'office'
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${enc}`
      : `https://docs.google.com/gview?url=${enc}&embedded=true`

  const isPDF = /\.pdf$/i.test(url)
  // PDFs render directly — skip Office viewer
  const effectiveSrc = isPDF ? url : src

  const header = (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-700 to-orange-700 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xl shrink-0">📊</span>
        <span className="text-white font-bold text-sm truncate">{title}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!isPDF && (
          <div className="flex rounded-lg overflow-hidden border border-white/25">
            {(['office', 'google'] as const).map((e) => (
              <button
                key={e}
                onClick={() => { setEngine(e); setLoaded(false) }}
                className={`px-3 py-1.5 text-xs font-bold transition ${
                  engine === e ? 'bg-white text-amber-900' : 'text-white hover:bg-white/15'
                }`}
              >
                {e === 'office' ? 'Office' : 'Google'}
              </button>
            ))}
          </div>
        )}
        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition"
          onClick={(e) => e.stopPropagation()}
        >
          ⬇ تحميل
        </a>
        <button
          onClick={() => setFullscreen((f) => !f)}
          className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition"
          title={fullscreen ? 'تصغير' : 'تكبير'}
        >
          {fullscreen ? '⤢' : '⤡'}
        </button>
        {fullscreen && (
          <button
            onClick={() => setFullscreen(false)}
            className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )

  const iframe = (
    <div className="relative flex-1">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10 gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70 text-sm">جاري تحميل العرض…</p>
        </div>
      )}
      <iframe
        key={effectiveSrc}
        src={effectiveSrc}
        className="w-full h-full border-0"
        title={title}
        onLoad={() => setLoaded(true)}
        allowFullScreen
      />
    </div>
  )

  if (fullscreen) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-slate-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {header}
          {iframe}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl flex flex-col" style={{ height: 520 }}>
      {header}
      {iframe}
    </div>
  )
}
