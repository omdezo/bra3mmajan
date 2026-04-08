"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";
import { useState, useEffect } from "react";

interface ApiItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  contentType?: 'video' | 'pdf';
  icon: string;
  color: string;
  youtubeId?: string;
  videoUrl?: string;
  pdfUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  pageCount?: number;
  isComingSoon: boolean;
  isFeatured?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  'رسوم متحركة': 'from-purple-500 to-purple-700',
  'أناشيد': 'from-pink-500 to-pink-700',
  'فيديوهات تعليمية': 'from-blue-500 to-blue-700',
  'برامج أطفال': 'from-green-500 to-green-700',
  'أنشطة تفاعلية': 'from-amber-500 to-orange-600',
  'أوراق عمل': 'from-teal-500 to-emerald-600',
};

const CATEGORY_BADGE: Record<string, string> = {
  'رسوم متحركة': 'bg-purple-100 text-purple-700',
  'أناشيد': 'bg-pink-100 text-pink-700',
  'فيديوهات تعليمية': 'bg-blue-100 text-blue-700',
  'برامج أطفال': 'bg-green-100 text-green-700',
  'أنشطة تفاعلية': 'bg-amber-100 text-amber-700',
  'أوراق عمل': 'bg-teal-100 text-teal-700',
};

function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

const STATIC_VIDEOS: ApiItem[] = [];

export default function WatchPage() {
  const [items, setItems] = useState<ApiItem[]>(STATIC_VIDEOS);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'pdf'>('all');

  useEffect(() => {
    fetch('/api/watch?limit=50')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setItems(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const videos = items.filter(i => i.contentType !== 'pdf');
  const pdfs = items.filter(i => i.contentType === 'pdf');
  const filteredItems = activeFilter === 'all' ? items :
    activeFilter === 'pdf' ? pdfs : videos;

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-pink-900" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ top: `${(i * 47 + 13) % 100}%`, left: `${(i * 37 + 23) % 100}%` }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: (i % 3) + 2, repeat: Infinity }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/#watch" className="inline-flex items-center gap-2 text-pink-300 font-bold mb-6 hover:gap-4 transition-all">
            <span>→</span><span>العودة للرئيسية</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="relative w-64 h-64"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Image src="/assets/فرح.png" alt="فرح" fill className="object-contain drop-shadow-2xl" />
            </motion.div>

            <div className="flex-1 text-center md:text-right">
              <motion.h1
                className="text-5xl md:text-7xl font-black text-pink-300 mb-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
              >
                📺 شاشة البراعم
              </motion.h1>
              <motion.p
                className="text-2xl md:text-3xl text-purple-200 font-bold mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                مع فرح - الفراشة المبدعة
              </motion.p>
              <motion.p
                className="text-lg md:text-xl text-purple-100 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                محتوى مرئي متنوع من الكرتون والأناشيد والأنشطة التفاعلية!
                <br />
                <span className="text-pink-300 font-bold">استمتع بالمشاهدة مع فرح! 🦋</span>
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center text-pink-300 mb-8">اختر ما تحب</h2>

          {/* Filter Tabs */}
          {pdfs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-3 mb-10"
            >
              {([
                { key: 'all', label: 'الكل', icon: '✨', count: items.length },
                { key: 'video', label: 'فيديوهات', icon: '🎬', count: videos.length },
                { key: 'pdf', label: 'أنشطة PDF', icon: '📄', count: pdfs.length },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    activeFilter === tab.key
                      ? 'bg-white text-purple-900 shadow-lg shadow-white/20 scale-105'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeFilter === tab.key ? 'bg-purple-100 text-purple-700' : 'bg-white/10'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => {
                const isPdf = item.contentType === 'pdf';
                return isPdf
                  ? <PdfCard key={item._id} item={item} index={index} />
                  : <VideoCard key={item._id} item={item} index={index} />;
              })}
            </div>
          )}
        </div>
      </section>

      {/* Character Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-pink-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border-4 border-pink-400 shadow-2xl"
          >
            <h2 className="text-4xl font-black text-pink-300 mb-6">عن فرح 🦋</h2>
            <p className="text-xl text-purple-100 leading-relaxed">
              <strong>فرح</strong> فراشة جميلة ترتدي ثوباً عُمانياً ملوناً، تحب الفن والإبداع وتقدم المحتوى بأسلوب شيّق ومميز!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Visitor Counter */}
      <section className="py-8 px-4 bg-gradient-to-b from-purple-900/50 to-pink-900/50">
        <div className="max-w-6xl mx-auto flex justify-center">
          <VisitorCounter pageName="watch" />
        </div>
      </section>
    </main>
  );
}

/* ---- Video Card ---- */
function VideoCard({ item, index }: { item: ApiItem; index: number }) {
  const thumb = item.thumbnailUrl || (item.youtubeId ? ytThumb(item.youtubeId) : '');
  const gradColor = CATEGORY_COLORS[item.category] ?? 'from-purple-500 to-purple-700';
  const badgeColor = CATEGORY_BADGE[item.category] ?? 'bg-purple-100 text-purple-700';
  const isYoutube = !!item.youtubeId;
  const watchUrl = item.youtubeId
    ? `https://www.yout-ube.com/watch?v=${item.youtubeId}`
    : item.videoUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-800">
        {thumb ? (
          <img
            src={thumb}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradColor} flex items-center justify-center`}>
            <span className="text-7xl drop-shadow-lg">{item.icon}</span>
          </div>
        )}

        {/* Play overlay */}
        {!item.isComingSoon && watchUrl && (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300"
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl">
              <span className="text-purple-700 text-2xl mr-[-3px]">▶</span>
            </div>
          </a>
        )}

        {/* Coming soon overlay */}
        {item.isComingSoon && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-yellow-400 text-yellow-900 px-5 py-2.5 rounded-full font-black text-lg border-2 border-yellow-600 shadow-lg">
              قريباً 🚀
            </div>
          </div>
        )}

        {/* Source badge */}
        {!item.isComingSoon && (
          <div className="absolute top-2 right-2">
            {isYoutube ? (
              <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow">
                <span>▶</span><span>YouTube</span>
              </div>
            ) : item.videoUrl ? (
              <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow">
                <span>🗂️</span><span>Drive</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Duration badge */}
        {item.duration && item.duration > 0 && !item.isComingSoon && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md">
            ⏱ {item.duration} دقيقة
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="bg-white p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${badgeColor}`}>
            {item.category}
          </span>
          {item.isFeatured && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 flex-shrink-0">
              ⭐ مميز
            </span>
          )}
        </div>
        <h3 className="text-lg font-black text-gray-800 mb-1 leading-snug">{item.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>

        <div className="mt-4">
          {item.isComingSoon ? (
            <button disabled className="w-full px-4 py-2.5 bg-gray-200 text-gray-400 rounded-xl font-bold cursor-not-allowed text-sm">
              قريباً 🚀
            </button>
          ) : watchUrl ? (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full text-center px-4 py-2.5 bg-gradient-to-r ${gradColor} text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-sm`}
            >
              {isYoutube ? '▶ شاهد على YouTube' : '▶ شاهد الآن'}
            </a>
          ) : (
            <button disabled className="w-full px-4 py-2.5 bg-gray-200 text-gray-400 rounded-xl font-bold cursor-not-allowed text-sm">
              غير متاح
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ---- PDF Card - Special child-friendly design ---- */
function PdfCard({ item, index }: { item: ApiItem; index: number }) {
  const gradColor = CATEGORY_COLORS[item.category] ?? 'from-amber-500 to-orange-600';
  const badgeColor = CATEGORY_BADGE[item.category] ?? 'bg-amber-100 text-amber-700';
  const viewUrl = item.pdfUrl
    ? `/watch/pdf?url=${encodeURIComponent(item.pdfUrl)}&title=${encodeURIComponent(item.title)}`
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
    >
      {/* Thumbnail / PDF Preview */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradColor} flex items-center justify-center relative`}>
            {/* Decorative paper effect */}
            <div className="absolute inset-4 bg-white/20 rounded-xl border-2 border-white/30 backdrop-blur-sm" />
            <div className="absolute inset-6 bg-white/10 rounded-lg border border-dashed border-white/20" />
            <span className="text-7xl drop-shadow-lg relative z-10">{item.icon || '📄'}</span>
          </div>
        )}

        {/* Open overlay */}
        {!item.isComingSoon && item.pdfUrl && (
          <Link
            href={viewUrl}
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300"
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl">
              <span className="text-amber-600 text-2xl">📖</span>
            </div>
          </Link>
        )}

        {/* Coming soon overlay */}
        {item.isComingSoon && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-yellow-400 text-yellow-900 px-5 py-2.5 rounded-full font-black text-lg border-2 border-yellow-600 shadow-lg">
              قريباً 🚀
            </div>
          </div>
        )}

        {/* PDF badge */}
        {!item.isComingSoon && (
          <div className="absolute top-2 right-2">
            <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow">
              <span>📄</span><span>PDF</span>
            </div>
          </div>
        )}

        {/* Page count badge */}
        {item.pageCount && item.pageCount > 0 && !item.isComingSoon && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md">
            📃 {item.pageCount} صفحة
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="bg-white p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${badgeColor}`}>
            {item.category}
          </span>
          {item.isFeatured && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 flex-shrink-0">
              ⭐ مميز
            </span>
          )}
        </div>
        <h3 className="text-lg font-black text-gray-800 mb-1 leading-snug">{item.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>

        <div className="mt-4">
          {item.isComingSoon ? (
            <button disabled className="w-full px-4 py-2.5 bg-gray-200 text-gray-400 rounded-xl font-bold cursor-not-allowed text-sm">
              قريباً 🚀
            </button>
          ) : item.pdfUrl ? (
            <Link
              href={viewUrl}
              className={`block w-full text-center px-4 py-2.5 bg-gradient-to-r ${gradColor} text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-sm`}
            >
              📖 افتح النشاط
            </Link>
          ) : (
            <button disabled className="w-full px-4 py-2.5 bg-gray-200 text-gray-400 rounded-xl font-bold cursor-not-allowed text-sm">
              غير متاح
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
