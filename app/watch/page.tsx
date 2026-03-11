"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Tv, Music, BookOpen, Clapperboard } from "lucide-react";
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
  isComingSoon: boolean;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'رسوم متحركة': Clapperboard,
  'أناشيد': Music,
  'فيديوهات تعليمية': BookOpen,
  'برامج أطفال': Tv,
};

const BG_COLORS = [
  "bg-purple-100", "bg-pink-100", "bg-blue-100", "bg-green-100",
  "bg-yellow-100", "bg-indigo-100", "bg-red-100", "bg-orange-100",
];

const GRADIENT_COLORS = [
  "from-purple-500 to-purple-700", "from-pink-500 to-pink-700",
  "from-blue-500 to-blue-700", "from-green-500 to-green-700",
  "from-yellow-500 to-yellow-700", "from-indigo-500 to-indigo-700",
];

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
      {/* Hero Section */}
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
            <span>→</span>
            <span>العودة للرئيسية</span>
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

      {/* Content Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center text-pink-300 mb-12">اختر ما تحب مشاهدته</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video, index) => {
                const IconComponent = CATEGORY_ICONS[video.category] ?? Tv;
                const bgColor = BG_COLORS[index % BG_COLORS.length];
                const gradColor = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
                return (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="relative group"
                  >
                    <div className={`${bgColor} rounded-3xl p-8 border-4 border-purple-400 shadow-xl hover:shadow-2xl transition-all`}>
                      <div className={`w-20 h-20 bg-gradient-to-br ${gradColor} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                        {video.icon ? (
                          <span className="text-4xl">{video.icon}</span>
                        ) : (
                          <IconComponent className="w-10 h-10 text-white" />
                        )}
                      </div>

                      <h3 className="text-3xl font-black text-gray-800 mb-3">{video.title}</h3>
                      <p className="text-sm font-bold text-purple-600 mb-2">{video.category}</p>
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">{video.description}</p>

                      {video.isComingSoon ? (
                        <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 rounded-full font-bold cursor-not-allowed shadow-lg">
                          قريباً 🚀
                        </button>
                      ) : video.youtubeId ? (
                        <a
                          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-block px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}
                        >
                          شاهد على يوتيوب ▶
                        </a>
                      ) : video.videoUrl ? (
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-block px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}
                        >
                          شاهد الآن ▶
                        </a>
                      ) : (
                        <button className={`px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}>
                          شاهد الآن
                        </button>
                      )}

                      {video.isComingSoon && (
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
