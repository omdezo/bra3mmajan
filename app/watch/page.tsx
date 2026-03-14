"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";
import { useState, useEffect } from "react";

interface ApiVideo {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  youtubeId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  isComingSoon: boolean;
  isFeatured?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  'رسوم متحركة': 'from-purple-500 to-purple-700',
  'أناشيد': 'from-pink-500 to-pink-700',
  'فيديوهات تعليمية': 'from-blue-500 to-blue-700',
  'برامج أطفال': 'from-green-500 to-green-700',
};

const CATEGORY_BADGE: Record<string, string> = {
  'رسوم متحركة': 'bg-purple-100 text-purple-700',
  'أناشيد': 'bg-pink-100 text-pink-700',
  'فيديوهات تعليمية': 'bg-blue-100 text-blue-700',
  'برامج أطفال': 'bg-green-100 text-green-700',
};

function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

const STATIC_VIDEOS: ApiVideo[] = [
  { _id: '1', title: "كرتون مغامرات براعم مجان", icon: "🎬", description: "شاهد أجمل المغامرات مع أبطال براعم مجان", category: "رسوم متحركة", color: "#8B5CF6", isComingSoon: true },
  { _id: '2', title: "أناشيد عُمانية", icon: "🎵", description: "استمع لأجمل الأناشيد الوطنية والتعليمية", category: "أناشيد", color: "#EC4899", isComingSoon: true },
  { _id: '3', title: "فيديوهات تعليمية", icon: "📚", description: "تعلم مع الفيديوهات التعليمية الشيقة", category: "فيديوهات تعليمية", color: "#3B82F6", isComingSoon: true },
  { _id: '4', title: "برامج أطفال", icon: "📺", description: "برامج ممتعة ومفيدة للأطفال", category: "برامج أطفال", color: "#10B981", isComingSoon: true },
];

export default function WatchPage() {
  const [videos, setVideos] = useState<ApiVideo[]>(STATIC_VIDEOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/watch?limit=20')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setVideos(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
                محتوى مرئي متنوع من الكرتون والأناشيد والدروس المصورة!
                <br />
                <span className="text-pink-300 font-bold">استمتع بالمشاهدة مع فرح! 🦋</span>
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center text-pink-300 mb-12">اختر ما تحب مشاهدته</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => {
                const thumb = video.thumbnailUrl || (video.youtubeId ? ytThumb(video.youtubeId) : '');
                const gradColor = CATEGORY_COLORS[video.category] ?? 'from-purple-500 to-purple-700';
                const badgeColor = CATEGORY_BADGE[video.category] ?? 'bg-purple-100 text-purple-700';
                const isYoutube = !!video.youtubeId;
                const watchUrl = video.youtubeId
                  ? `https://www.youtube.com/watch?v=${video.youtubeId}`
                  : video.videoUrl;

                return (
                  <motion.div
                    key={video._id}
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
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradColor} flex items-center justify-center`}>
                          <span className="text-7xl drop-shadow-lg">{video.icon}</span>
                        </div>
                      )}

                      {/* Dark overlay + play button */}
                      {!video.isComingSoon && watchUrl && (
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
                      {video.isComingSoon && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="bg-yellow-400 text-yellow-900 px-5 py-2.5 rounded-full font-black text-lg border-2 border-yellow-600 shadow-lg">
                            قريباً 🚀
                          </div>
                        </div>
                      )}

                      {/* Source badge */}
                      {!video.isComingSoon && (
                        <div className="absolute top-2 right-2">
                          {isYoutube ? (
                            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow">
                              <span>▶</span><span>YouTube</span>
                            </div>
                          ) : video.videoUrl ? (
                            <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow">
                              <span>🗂️</span><span>Drive</span>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {/* Duration badge */}
                      {video.duration && video.duration > 0 && !video.isComingSoon && (
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md">
                          ⏱ {video.duration} دقيقة
                        </div>
                      )}
                    </div>

                    {/* Card Info */}
                    <div className="bg-white p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${badgeColor}`}>
                          {video.category}
                        </span>
                        {video.isFeatured && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 flex-shrink-0">
                            ⭐ مميز
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-gray-800 mb-1 leading-snug">{video.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{video.description}</p>

                      <div className="mt-4">
                        {video.isComingSoon ? (
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
