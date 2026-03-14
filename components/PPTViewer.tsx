'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  url: string
  title: string
}

// Only resolve generic shorteners — NOT 1drv.ms/OneDrive since those already carry
// embed params (em=2, wdAr) that must be preserved for interactive mode
const SHORT_URL_PATTERN = /^https?:\/\/(bit\.ly|tinyurl\.com|aka\.ms)/i

export default function PPTViewer({ url, title }: Props) {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null)
  const [resolving, setResolving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  // If the stored value is a full <iframe> HTML string, extract the src from it
  const cleanUrl = (() => {
    const trimmed = url.trim()
    if (trimmed.startsWith('<')) {
      const m = trimmed.match(/src=["']([^"']+)["']/i)
      return m ? m[1].replace(/&amp;/g, '&') : url
    }
    return url
  })()

  const isPDF = /\.pdf$/i.test(cleanUrl)

  useEffect(() => {
    setLoaded(false)
    setResolvedSrc(null)

    if (isPDF) {
      setResolvedSrc(cleanUrl)
      return
    }

    if (SHORT_URL_PATTERN.test(cleanUrl)) {
      // Resolve short/redirect URLs server-side so the iframe gets the actual embed URL
      setResolving(true)
      fetch(`/api/resolve-url?url=${encodeURIComponent(cleanUrl)}`)
        .then(r => r.json())
        .then(d => setResolvedSrc(d.finalUrl ?? cleanUrl))
        .catch(() => setResolvedSrc(cleanUrl))
        .finally(() => setResolving(false))
    } else {
      setResolvedSrc(cleanUrl)
    }
  }, [cleanUrl, isPDF])

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

  const body = (
    <div className="relative flex-1">
      {(!loaded || resolving) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10 gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70 text-sm">
            {resolving ? 'جاري تحميل الرابط…' : 'جاري تحميل العرض…'}
          </p>
        </div>
      )}
      {resolvedSrc && (
        <iframe
          key={resolvedSrc}
          src={resolvedSrc}
          className="w-full h-full border-0"
          title={title}
          onLoad={() => setLoaded(true)}
          allowFullScreen
          allow="fullscreen"
        />
      )}
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
          {body}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="flex flex-col w-full h-full">
      {header}
      {body}
    </div>
  )
}
