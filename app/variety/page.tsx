"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";
import { useState, useEffect } from "react";

interface ApiTreasure {
  _id: string; title: string; description: string; category: string;
  icon: string; color: string; imageUrl?: string; videoUrl?: string;
  audioUrl?: string; pptUrl?: string; content?: string; isComingSoon: boolean;
}

/* ── Category themes ─────────────────────────────────────────── */
const THEMES: Record<string, { grad: string; pill: string; glow: string; accent: string }> = {
  'ركن الإبداع':    { grad: 'from-pink-400 to-rose-500',    pill: 'bg-pink-100 text-pink-700',    glow: 'rgba(236,72,153,.3)',  accent: '#ec4899' },
  'كنوز عُمانية':  { grad: 'from-amber-400 to-orange-500', pill: 'bg-amber-100 text-amber-700',  glow: 'rgba(245,158,11,.3)', accent: '#f59e0b' },
  'أغانٍ':         { grad: 'from-purple-400 to-violet-500', pill: 'bg-purple-100 text-purple-700',glow: 'rgba(139,92,246,.3)', accent: '#8b5cf6' },
  'أساليب تعليمية':{ grad: 'from-blue-400 to-cyan-500',    pill: 'bg-blue-100 text-blue-700',    glow: 'rgba(59,130,246,.3)', accent: '#3b82f6' },
}
const DEFAULT_THEME = { grad: 'from-indigo-400 to-violet-500', pill: 'bg-indigo-100 text-indigo-700', glow: 'rgba(99,102,241,.3)', accent: '#6366f1' }
const theme = (cat: string) => THEMES[cat] ?? DEFAULT_THEME

const STATIC: ApiTreasure[] = [
  { _id:'1', title:'ركن الإبداع',     icon:'🎨', description:'تلوين، رسم، أشغال يدوية، فنون عُمانية تقليدية', category:'ركن الإبداع',    color:'#EC4899', isComingSoon:true },
  { _id:'2', title:'كنوز عُمان',      icon:'🏰', description:'القلاع والحصون، الولايات، الأزياء التقليدية',    category:'كنوز عُمانية',  color:'#F59E0B', isComingSoon:true },
  { _id:'3', title:'ركن الأناشيد',   icon:'🎵', description:'أناشيد وطنية، تعليمية، إسلامية للأطفال',         category:'أغانٍ',         color:'#8B5CF6', isComingSoon:true },
  { _id:'4', title:'تقنيات التعليم', icon:'🎓', description:'شروحات للمنهج العُماني، تمارين تفاعلية',           category:'أساليب تعليمية',color:'#3B82F6', isComingSoon:true },
]

const isCanva  = (u: string) => u.includes('canva.com')
const isGDrive = (u: string) => u.includes('drive.google.com')

function gDriveProxy(url: string) {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)
  return m ? `/api/proxy-pdf?id=${m[1]}` : url
}

/* ── Content type badge ──────────────────────────────────────── */
function typeBadge(item: ApiTreasure) {
  if (item.isComingSoon)                         return { icon:'🚀', label:'قريباً',    cls:'bg-yellow-100 text-yellow-700' }
  if (item.pptUrl && isGDrive(item.pptUrl))      return { icon:'📄', label:'PDF',       cls:'bg-blue-100 text-blue-700' }
  if (item.pptUrl && isCanva(item.pptUrl))       return { icon:'🎨', label:'عرض',       cls:'bg-pink-100 text-pink-700' }
  if (item.pptUrl)                               return { icon:'📊', label:'عرض',       cls:'bg-orange-100 text-orange-700' }
  if (item.videoUrl)                             return { icon:'🎥', label:'فيديو',     cls:'bg-red-100 text-red-700' }
  if (item.audioUrl)                             return { icon:'🔊', label:'صوت',       cls:'bg-violet-100 text-violet-700' }
  if (item.content)                              return { icon:'📝', label:'محتوى',     cls:'bg-green-100 text-green-700' }
  return                                                { icon:'✨', label:'استكشف',    cls:'bg-slate-100 text-slate-600' }
}

/* ── Auto-thumbnail hook ─────────────────────────────────────── */
function usePptThumb(pptUrl?: string) {
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    if (!pptUrl) return
    setSrc(null)
    fetch(`/api/thumbnail?url=${encodeURIComponent(pptUrl)}`)
      .then(r => r.json()).then(d => { if (d.url) setSrc(d.url) }).catch(() => {})
  }, [pptUrl])
  return src
}

/* ── Card ────────────────────────────────────────────────────── */
function TreasureCard({ item, onOpenPdf, onOpenModal }: {
  item: ApiTreasure
  onOpenPdf: (i: ApiTreasure) => void
  onOpenModal: (i: ApiTreasure) => void
}) {
  const t    = theme(item.category)
  const badge = typeBadge(item)
  const autoThumb = usePptThumb(!item.imageUrl ? item.pptUrl : undefined)
  const thumbSrc  = item.imageUrl || autoThumb
  const [thumbOk, setThumbOk] = useState(true)
  const [thumbReady, setThumbReady] = useState(false)

  // reset when thumb src changes
  useEffect(() => { setThumbOk(true); setThumbReady(false) }, [thumbSrc])

  const hasAction = !item.isComingSoon && (item.pptUrl || item.videoUrl || item.audioUrl || item.content)

  const handleClick = () => {
    if (!hasAction) return
    if (item.pptUrl && isGDrive(item.pptUrl)) return onOpenPdf(item)
    if (item.pptUrl && isCanva(item.pptUrl))  return onOpenModal(item)
    if (item.pptUrl)                           return window.open(item.pptUrl, '_blank')
    onOpenModal(item)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: `0 20px 40px -8px ${t.glow}` }}
      transition={{ duration: 0.25 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-md cursor-pointer select-none"
      style={{ willChange: 'transform' }}
      onClick={handleClick}
    >
      {/* ── Cover image / gradient ── */}
      <div className="relative aspect-video w-full overflow-hidden">
        {thumbSrc && thumbOk ? (
          <>
            {!thumbReady && <div className="absolute inset-0 animate-pulse bg-gray-100" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbSrc} alt={item.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${thumbReady ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setThumbReady(true)}
              onError={() => setThumbOk(false)}
            />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${t.grad} flex items-center justify-center`}>
            <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              {item.icon || '💎'}
            </span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm bg-white/85 ${badge.cls}`}>
            {badge.icon} {badge.label}
          </span>
        </div>

        {/* Coming soon overlay */}
        {item.isComingSoon && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-yellow-400 text-yellow-900 px-5 py-2.5 rounded-2xl font-black text-lg shadow-lg">
              🚀 قريباً
            </span>
          </div>
        )}

        {/* Hover play hint */}
        {hasAction && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur rounded-2xl px-4 py-2 text-sm font-bold text-gray-800 shadow-lg">
              {item.pptUrl && isGDrive(item.pptUrl) ? '📄 افتح الملف' :
               item.pptUrl && isCanva(item.pptUrl)  ? '🎨 افتح العرض' :
               item.videoUrl ? '🎥 شاهد الآن' :
               item.audioUrl ? '🔊 استمع الآن' : '✨ استكشف'}
            </div>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-5">
        {/* Category pill */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-3 ${t.pill}`}>
          {item.category}
        </span>

        <h3 className="text-xl font-black text-gray-900 leading-snug mb-1.5">{item.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-5">{item.description}</p>

        {/* Action button */}
        <button
          disabled={item.isComingSoon}
          className={`w-full py-3 rounded-2xl font-black text-white text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${t.grad} shadow-sm group-hover:shadow-md`}
        >
          {item.isComingSoon ? 'قريباً 🚀' :
           item.pptUrl && isGDrive(item.pptUrl) ? '📄 افتح الملف' :
           item.pptUrl && isCanva(item.pptUrl)  ? '🎨 افتح العرض' :
           item.pptUrl                          ? '📊 افتح العرض' :
           item.videoUrl ? '🎥 شاهد الآن' :
           item.audioUrl ? '🔊 استمع الآن' :
           item.content  ? '✨ استكشف' : 'اكتشف الآن'}
        </button>
      </div>
    </motion.div>
  )
}

/* ── Full-screen PDF viewer ──────────────────────────────────── */
function PDFFullscreen({ item, onClose }: { item: ApiTreasure; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-[100] flex flex-col bg-gray-950"
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-700 to-orange-700 shrink-0 shadow-lg">
        <button onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-black text-sm transition active:scale-95 shrink-0">
          ✕ إغلاق
        </button>
        <p className="flex-1 text-center text-white font-black text-base truncate">📄 {item.title}</p>
        <a href={item.pptUrl!.replace('/preview', '/view')} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-sm transition shrink-0">
          🔗 Drive
        </a>
      </div>
      <div className="flex-1 relative bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="flex flex-col items-center gap-3 text-white/50">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">جاري تحميل الملف…</p>
          </div>
        </div>
        <embed src={gDriveProxy(item.pptUrl!)} type="application/pdf"
          className="absolute inset-0 w-full h-full z-10" />
      </div>
    </motion.div>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function VarietyPage() {
  const [items, setItems]     = useState<ApiTreasure[]>(STATIC)
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState<ApiTreasure | null>(null)
  const [pdfItem, setPdfItem] = useState<ApiTreasure | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/variety?limit=50')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setItems(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = ['الكل', ...Array.from(new Set(items.map(i => i.category)))]
  const filtered = activeCategory && activeCategory !== 'الكل'
    ? items.filter(i => i.category === activeCategory)
    : items

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50" dir="rtl">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #92400e 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/#variety"
            className="inline-flex items-center gap-2 text-amber-700 font-bold mb-8 hover:gap-3 transition-all text-sm">
            ← العودة للرئيسية
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div className="relative w-52 h-52 shrink-0"
              initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180 }}>
              <Image src="/assets/مها.png" alt="مها" fill className="object-contain drop-shadow-2xl" />
            </motion.div>
            <div className="flex-1 text-center md:text-right">
              <motion.h1 className="text-5xl md:text-6xl font-black text-amber-800 mb-3"
                initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
                🦌 قسم المنوعات
              </motion.h1>
              <motion.p className="text-xl text-amber-600 font-bold mb-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                مع مَها — المهاة الرشيقة
              </motion.p>
              <motion.p className="text-base text-gray-600 leading-relaxed"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                أنشطة إضافية ومحتوى ثري يكمل تجربة التعلم — <span className="font-bold text-amber-700">اكتشف كنوز عُمان! 🎨</span>
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category filter tabs ── */}
      {!loading && items.length > 0 && (
        <div className="px-4 pb-2">
          <div className="max-w-5xl mx-auto flex gap-2 flex-wrap">
            {categories.map(cat => {
              const t = cat === 'الكل' ? null : theme(cat)
              const active = (activeCategory ?? 'الكل') === cat
              return (
                <button key={cat} onClick={() => setActiveCategory(cat === 'الكل' ? null : cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border-2 ${
                    active
                      ? `text-white border-transparent shadow-md ${t ? `bg-gradient-to-r ${t.grad}` : 'bg-amber-500'}`
                      : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                  }`}>
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Grid ── */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            /* Skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-md animate-pulse">
                  <div className="aspect-video bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-20 bg-gray-100 rounded-full" />
                    <div className="h-5 w-3/4 bg-gray-100 rounded-full" />
                    <div className="h-3 w-full bg-gray-100 rounded-full" />
                    <div className="h-10 bg-gray-100 rounded-2xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, idx) => (
                  <motion.div key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.04 }}>
                    <TreasureCard
                      item={item}
                      onOpenPdf={setPdfItem}
                      onOpenModal={setModal}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Google Drive fullscreen PDF ── */}
      <AnimatePresence>
        {pdfItem && <PDFFullscreen item={pdfItem} onClose={() => setPdfItem(null)} />}
      </AnimatePresence>

      {/* ── Canva / video / audio modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModal(null)}>
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto"
              initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }}
              onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className={`flex items-center justify-between px-6 py-4 bg-gradient-to-r ${theme(modal.category).grad} rounded-t-3xl`}>
                <h3 className="text-xl font-black text-white">{modal.title}</h3>
                <button onClick={() => setModal(null)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full font-black flex items-center justify-center transition">✕</button>
              </div>

              <div className="p-6 space-y-4">
                {modal.pptUrl && isCanva(modal.pptUrl) && (
                  <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-amber-200"
                    style={{ position:'relative', width:'100%', paddingTop:'56.25%' }}>
                    <iframe loading="lazy"
                      style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }}
                      src={modal.pptUrl} allowFullScreen allow="fullscreen" title={modal.title} />
                  </div>
                )}
                {modal.imageUrl && !modal.pptUrl && (
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden">
                    <Image src={modal.imageUrl} alt={modal.title} fill className="object-cover" />
                  </div>
                )}
                {modal.videoUrl && <video controls className="w-full rounded-2xl" src={modal.videoUrl} />}
                {modal.audioUrl && <audio controls className="w-full" src={modal.audioUrl} />}
                {modal.content  && (
                  <p className="text-gray-700 leading-relaxed text-right whitespace-pre-wrap">{modal.content}</p>
                )}
                {modal.pptUrl && isCanva(modal.pptUrl) && (
                  <a href={modal.pptUrl.replace('?embed', '')} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-bold text-sm transition">
                    🔗 فتح في Canva
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Visitor counter ── */}
      <section className="py-8 px-4 bg-amber-50 border-t border-amber-100">
        <div className="max-w-5xl mx-auto flex justify-center">
          <VisitorCounter pageName="variety" />
        </div>
      </section>
    </main>
  )
}
