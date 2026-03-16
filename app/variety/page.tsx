"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Palette, Castle, Music, GraduationCap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";
import { useState, useEffect } from "react";

interface ApiTreasure {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  pptUrl?: string;
  content?: string;
  isComingSoon: boolean;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'ركن الإبداع': Palette,
  'كنوز عُمانية': Castle,
  'أغانٍ': Music,
  'أساليب تعليمية': GraduationCap,
};

const BG_COLORS = [
  "bg-pink-100", "bg-amber-100", "bg-purple-100", "bg-blue-100",
  "bg-green-100", "bg-yellow-100", "bg-indigo-100", "bg-red-100",
];

const GRADIENT_COLORS = [
  "from-pink-500 to-pink-700", "from-amber-500 to-amber-700",
  "from-purple-500 to-purple-700", "from-blue-500 to-blue-700",
  "from-green-500 to-green-700", "from-yellow-500 to-yellow-700",
];

const STATIC_TREASURES: ApiTreasure[] = [
  { _id: '1', title: "ركن الإبداع", icon: "🎨", description: "تلوين، رسم، أشغال يدوية، فنون عُمانية تقليدية", category: "ركن الإبداع", color: "#EC4899", isComingSoon: true },
  { _id: '2', title: "كنوز عُمان", icon: "🏰", description: "القلاع والحصون، الولايات، الأزياء التقليدية، الحرف اليدوية", category: "كنوز عُمانية", color: "#F59E0B", isComingSoon: true },
  { _id: '3', title: "ركن الأناشيد", icon: "🎵", description: "أناشيد وطنية، تعليمية، إسلامية للأطفال", category: "أغانٍ", color: "#8B5CF6", isComingSoon: true },
  { _id: '4', title: "تقنيات التعليم", icon: "🎓", description: "شروحات للمنهج العُماني، تمارين تفاعلية، مراجعات", category: "أساليب تعليمية", color: "#3B82F6", isComingSoon: true },
];

const isCanva  = (url: string) => url.includes('canva.com');
const isGDrive = (url: string) => url.includes('drive.google.com');

/* ── Auto thumbnail for pptUrl cards ────────────────────────── */
function PptThumbnail({
  pptUrl, title, icon, IconComp, gradColor,
}: {
  pptUrl: string
  title: string
  icon: string
  IconComp: React.ElementType
  gradColor: string
}) {
  const [src, setSrc]       = useState<string | null>(null)
  const [ready, setReady]   = useState(false)
  const [imgOk, setImgOk]   = useState(true)

  useEffect(() => {
    setSrc(null); setReady(false); setImgOk(true)
    fetch(`/api/thumbnail?url=${encodeURIComponent(pptUrl)}`)
      .then(r => r.json())
      .then(d => { if (d.url) setSrc(d.url) })
      .catch(() => {})
  }, [pptUrl])

  // Fallback icon when no thumbnail
  if (!src || !imgOk) {
    return (
      <div className={`w-20 h-20 bg-gradient-to-br ${gradColor} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
        {icon ? <span className="text-4xl">{icon}</span> : <IconComp className="w-10 h-10 text-white" />}
      </div>
    )
  }

  return (
    <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 shadow-md border-2 border-amber-200 relative bg-amber-50">
      {/* skeleton */}
      {!ready && <div className="absolute inset-0 animate-pulse bg-amber-100" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setReady(true)}
        onError={() => setImgOk(false)}
      />
    </div>
  )
}

function gDriveProxyUrl(url: string): string {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  return m ? `/api/proxy-pdf?id=${m[1]}` : url;
}

function gDriveViewUrl(url: string): string {
  return url.replace('/preview', '/view');
}

/* ── Full-screen PDF viewer (Google Drive) ───────────────────── */
function PDFFullscreen({ item, onClose }: { item: ApiTreasure; onClose: () => void }) {
  const proxyUrl = gDriveProxyUrl(item.pptUrl!);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-gray-950"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.2 }}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-700 to-orange-700 shrink-0 shadow-lg">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-black text-sm transition active:scale-95 shrink-0"
        >
          ✕ إغلاق
        </button>

        <div className="flex-1 min-w-0 text-center">
          <p className="text-white font-black text-base truncate">📄 {item.title}</p>
        </div>

        <a
          href={gDriveViewUrl(item.pptUrl!)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-sm transition shrink-0"
        >
          🔗 Drive
        </a>
      </div>

      {/* PDF viewer — <embed> uses the browser's native PDF renderer, no download */}
      <div className="flex-1 relative bg-gray-900">
        {/* Loading backdrop */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="flex flex-col items-center gap-3 text-white/50">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">جاري تحميل الملف…</p>
          </div>
        </div>
        <embed
          src={proxyUrl}
          type="application/pdf"
          className="absolute inset-0 w-full h-full z-10"
        />
      </div>
    </motion.div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function VarietyPage() {
  const [items, setItems]     = useState<ApiTreasure[]>(STATIC_TREASURES);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState<ApiTreasure | null>(null);   // Canva / video / audio
  const [pdfItem, setPdfItem] = useState<ApiTreasure | null>(null);   // Google Drive PDF fullscreen

  useEffect(() => {
    fetch('/api/variety?limit=20')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setItems(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-yellow-50" dir="rtl">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(180,83,9,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/#variety" className="inline-flex items-center gap-2 text-amber-700 font-bold mb-6 hover:gap-4 transition-all">
            <span>→</span><span>العودة للرئيسية</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="relative w-64 h-64"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Image src="/assets/مها.png" alt="مها" fill className="object-contain drop-shadow-2xl" />
            </motion.div>

            <div className="flex-1 text-center md:text-right">
              <motion.h1 className="text-5xl md:text-7xl font-black text-amber-700 mb-4"
                initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
                🦌 قسم المنوعات
              </motion.h1>
              <motion.p className="text-2xl md:text-3xl text-amber-600 font-bold mb-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                مع مَها - المهاة الرشيقة
              </motion.p>
              <motion.p className="text-lg md:text-xl text-gray-700 leading-relaxed"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                أنشطة إضافية ومحتوى ثري يكمل تجربة التعلم!
                <br />
                <span className="text-amber-700 font-bold">اكتشف كنوز عُمان مع مها! 🎨</span>
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center text-amber-700 mb-12">اختر نشاطك المفضل</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item, index) => {
                const IconComponent = CATEGORY_ICONS[item.category] ?? Palette;
                const bgColor   = BG_COLORS[index % BG_COLORS.length];
                const gradColor = GRADIENT_COLORS[index % GRADIENT_COLORS.length];

                return (
                  <motion.div key={item._id}
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="relative group"
                  >
                    <div className={`${bgColor} rounded-3xl p-8 border-4 border-amber-400 shadow-xl hover:shadow-2xl transition-all`}>
                      {item.imageUrl ? (
                        <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6">
                          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                        </div>
                      ) : item.pptUrl ? (
                        <PptThumbnail
                          pptUrl={item.pptUrl}
                          title={item.title}
                          icon={item.icon}
                          IconComp={IconComponent}
                          gradColor={gradColor}
                        />
                      ) : (
                        <div className={`w-20 h-20 bg-gradient-to-br ${gradColor} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                          {item.icon
                            ? <span className="text-4xl">{item.icon}</span>
                            : <IconComponent className="w-10 h-10 text-white" />}
                        </div>
                      )}

                      <h3 className="text-3xl font-black text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-sm font-bold text-amber-700 mb-3">{item.category}</p>
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">{item.description}</p>

                      {/* Action button */}
                      {item.isComingSoon ? (
                        <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 rounded-full font-bold cursor-not-allowed">
                          قريباً 🚀
                        </button>
                      ) : item.pptUrl && isGDrive(item.pptUrl) ? (
                        <button
                          onClick={() => setPdfItem(item)}
                          className={`px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}
                        >
                          📄 افتح الملف
                        </button>
                      ) : item.pptUrl && isCanva(item.pptUrl) ? (
                        <button
                          onClick={() => setModal(item)}
                          className={`px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}
                        >
                          🎨 افتح العرض
                        </button>
                      ) : item.pptUrl ? (
                        <a href={item.pptUrl} target="_blank" rel="noopener noreferrer"
                          className={`inline-block px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}>
                          📊 افتح العرض
                        </a>
                      ) : (item.content || item.videoUrl || item.audioUrl) ? (
                        <button onClick={() => setModal(item)}
                          className={`px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}>
                          {item.videoUrl ? '🎥 شاهد' : item.audioUrl ? '🔊 استمع' : '✨ استكشف'}
                        </button>
                      ) : (
                        <button className={`px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}>
                          استكشف الآن
                        </button>
                      )}

                      {item.isComingSoon && (
                        <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-sm border-2 border-yellow-600">
                          قريباً
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Google Drive PDF fullscreen viewer ── */}
      <AnimatePresence>
        {pdfItem && (
          <PDFFullscreen item={pdfItem} onClose={() => setPdfItem(null)} />
        )}
      </AnimatePresence>

      {/* ── Canva / video / audio modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl border-8 border-amber-400 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <button onClick={() => setModal(null)}
                  className="px-4 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600">
                  ✕ إغلاق
                </button>
                <h3 className="text-3xl font-black text-amber-900">{modal.title}</h3>
              </div>

              {/* Canva embed — 16:9 */}
              {modal.pptUrl && isCanva(modal.pptUrl) && (
                <div className="rounded-2xl overflow-hidden mb-6 shadow-xl border-4 border-amber-300"
                  style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                  <iframe
                    loading="lazy"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    src={modal.pptUrl}
                    allowFullScreen allow="fullscreen"
                    title={modal.title}
                  />
                </div>
              )}

              {modal.imageUrl && !modal.pptUrl && (
                <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6">
                  <Image src={modal.imageUrl} alt={modal.title} fill className="object-cover" />
                </div>
              )}
              {modal.videoUrl && <video controls className="w-full rounded-2xl mb-6" src={modal.videoUrl} />}
              {modal.audioUrl && <audio controls className="w-full mb-6" src={modal.audioUrl} />}
              {modal.content && (
                <div className="prose max-w-none text-right text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {modal.content}
                </div>
              )}

              {modal.pptUrl && isCanva(modal.pptUrl) && (
                <a href={modal.pptUrl.replace('?embed', '')} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-bold text-sm transition">
                  <span>🔗</span><span>فتح في Canva</span>
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Character section ── */}
      <section className="py-16 px-4 bg-gradient-to-b from-amber-200 to-amber-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }} viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 border-4 border-amber-400 shadow-2xl">
            <h2 className="text-4xl font-black text-amber-700 mb-6">عن مَها 🦌</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              <strong>مها</strong> - المهاة العُمانية، رشيقة ولطيفة، ترمز للجمال العُماني الأصيل، ترشد الأطفال في قسم المنوعات وتقدم لهم الأنشطة المتنوعة بأسلوب محبب!
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Visitor counter ── */}
      <section className="py-8 px-4 bg-gradient-to-b from-amber-100 to-amber-200">
        <div className="max-w-6xl mx-auto flex justify-center">
          <VisitorCounter pageName="variety" />
        </div>
      </section>
    </main>
  );
}
