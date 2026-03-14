'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  url: string
  title: string
}

export default function PPTViewer({ url, title }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  // If it's an R2 PDF → display directly; otherwise embed as-is (OneDrive/any embed URL)
  const isPDF = /\.pdf$/i.test(url)
  const src = isPDF
    ? url
    : url // OneDrive embed URL used directly

  const header = (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-700 to-orange-700 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xl shrink-0">📊</span>
        <span className="text-white font-bold text-sm truncate">{title}</span>
      </div>
      <button
        onClick={() => setFullscreen(f => !f)}
        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition"
        title={fullscreen ? 'تصغير' : 'تكبير'}
      >
        {fullscreen ? '⤢' : '⤡'}
      </button>
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
        key={src}
        src={src}
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
