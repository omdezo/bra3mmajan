'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

function PdfViewerInner() {
  const params = useSearchParams()
  const url = params.get('url')
  const title = params.get('title') || 'عرض الملف'

  if (!url) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900 via-orange-900 to-yellow-900 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-amber-200 mb-4">لم يتم تحديد الملف</h1>
          <Link href="/watch" className="text-amber-300 hover:text-amber-200 font-bold underline">
            العودة لشاشة البراعم
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-orange-900 to-yellow-900 flex flex-col" dir="rtl">
      {/* Top Bar */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 md:px-6 py-3 bg-black/30 backdrop-blur-md border-b border-amber-500/20 flex-shrink-0 z-10"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/watch"
            className="flex items-center gap-2 text-amber-300 hover:text-amber-100 font-bold text-sm transition-colors flex-shrink-0"
          >
            <span className="text-lg">→</span>
            <span className="hidden sm:inline">العودة</span>
          </Link>
          <div className="w-px h-6 bg-amber-500/30 flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl flex-shrink-0">📄</span>
            <h1 className="text-base md:text-lg font-bold text-amber-100 truncate">{title}</h1>
          </div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 px-3 md:px-4 py-2 rounded-xl text-sm font-bold transition-colors flex-shrink-0"
        >
          <span>⬇️</span>
          <span className="hidden sm:inline">تحميل</span>
        </a>
      </motion.header>

      {/* PDF Embed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 p-2 md:p-4"
      >
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/20 bg-white">
          <embed
            src={url + '#toolbar=1&navpanes=0&scrollbar=1'}
            type="application/pdf"
            className="w-full h-full min-h-[calc(100vh-80px)]"
          />
        </div>
      </motion.div>
    </div>
  )
}

export default function PdfViewerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-900 via-orange-900 to-yellow-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PdfViewerInner />
    </Suspense>
  )
}
