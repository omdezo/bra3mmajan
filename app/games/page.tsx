"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";

interface ApiGame {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  icon: string;
  color: string;
  stars: number;
  playersCount: number;
  isComingSoon: boolean;
  isExternalLink: boolean;
  externalLink?: string;
}

const CATEGORY_THEMES: Record<string, { gradient: string; badge: string; glow: string }> = {
  'الحساب':           { gradient: 'from-blue-500 to-indigo-600',    badge: 'bg-blue-100 text-blue-700',    glow: 'shadow-blue-500/30' },
  'اللغة العربية':    { gradient: 'from-emerald-500 to-teal-600',   badge: 'bg-emerald-100 text-emerald-700', glow: 'shadow-emerald-500/30' },
  'الألغاز':          { gradient: 'from-purple-500 to-violet-600',  badge: 'bg-purple-100 text-purple-700', glow: 'shadow-purple-500/30' },
  'الذاكرة':          { gradient: 'from-pink-500 to-rose-600',      badge: 'bg-pink-100 text-pink-700',     glow: 'shadow-pink-500/30' },
  'العلوم':           { gradient: 'from-amber-500 to-orange-600',   badge: 'bg-amber-100 text-amber-700',   glow: 'shadow-amber-500/30' },
  'اللغة الإنجليزية': { gradient: 'from-cyan-500 to-blue-600',     badge: 'bg-cyan-100 text-cyan-700',     glow: 'shadow-cyan-500/30' },
  'أنشطة متنوعة':    { gradient: 'from-rose-500 to-pink-600',      badge: 'bg-rose-100 text-rose-700',     glow: 'shadow-rose-500/30' },
};
const DEFAULT_THEME = { gradient: 'from-indigo-500 to-purple-600', badge: 'bg-indigo-100 text-indigo-700', glow: 'shadow-indigo-500/30' };
const themeOf = (cat: string) => CATEGORY_THEMES[cat] ?? DEFAULT_THEME;

export default function GamesPage() {
  const [games, setGames] = useState<ApiGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/games?limit=50')
      .then(r => r.json())
      .then(d => { if (d.success) setGames(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(games.map(g => g.category)));
  const filtered = activeCategory ? games.filter(g => g.category === activeCategory) : games;

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-100 relative overflow-hidden" dir="rtl">
      <Navbar />

      {/* Desert background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Sand dunes */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-[0.08]">
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path fill="#92400e" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,234.7C840,245,960,235,1080,218.7C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          </svg>
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path fill="#b45309" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        {/* Floating desert elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{ left: `${(i * 37 + 13) % 90 + 5}%`, top: `${(i * 47 + 23) % 70 + 10}%` }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: (i % 3) + 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {['🌴', '🏜️', '⭐', '🌙', '🐪', '🏰', '✨', '🦎'][i]}
          </motion.div>
        ))}
      </div>

      {/* Hero */}
      <section className="relative z-10 pt-8 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/#games" className="inline-flex items-center gap-2 text-amber-800 font-bold mb-6 hover:gap-4 transition-all">
            <span>→</span><span>العودة للرئيسية</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div
              className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Image src="/assets/فهد.png" alt="فهد" fill className="object-contain drop-shadow-2xl" />
              <motion.div
                className="absolute -top-3 -right-3 text-3xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮
              </motion.div>
            </motion.div>

            <div className="flex-1 text-center md:text-right">
              <motion.h1
                className="text-5xl md:text-7xl font-black mb-3"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="bg-gradient-to-r from-amber-700 to-orange-600 text-transparent bg-clip-text">
                  واحة الألعاب
                </span>
                <span className="text-4xl md:text-5xl mr-2">🏜️</span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-amber-700 font-bold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                مع فَهد — الشبل النشيط 🦁
              </motion.p>
              <motion.p
                className="text-base text-amber-600/80 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ألعاب تعليمية ممتعة في واحة الصحراء — اختر لعبتك وابدأ المغامرة!
              </motion.p>
              <motion.div
                className="flex items-center gap-3 justify-center md:justify-end mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="bg-amber-200/60 border border-amber-300 text-amber-800 px-4 py-1.5 rounded-full text-sm font-bold">
                  🎯 {games.length} لعبة متاحة
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      {!loading && games.length > 0 && (
        <div className="relative z-10 px-4 pb-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                  !activeCategory
                    ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-500/30'
                    : 'bg-white/70 text-amber-800 border-amber-200 hover:border-amber-400'
                }`}
              >
                الكل ({games.length})
              </button>
              {categories.map(cat => {
                const t = themeOf(cat);
                const count = games.filter(g => g.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                      activeCategory === cat
                        ? `bg-gradient-to-r ${t.gradient} text-white border-transparent shadow-lg ${t.glow}`
                        : 'bg-white/70 text-amber-800 border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Games Grid */}
      <section className="relative z-10 py-8 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/60 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-amber-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 w-3/4 bg-amber-100 rounded-full" />
                    <div className="h-3 w-1/2 bg-amber-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((game, i) => {
                  const t = themeOf(game.category);
                  const playUrl = game.isExternalLink && game.externalLink ? game.externalLink : '#';

                  return (
                    <motion.div
                      key={game._id}
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ delay: i * 0.03 }}
                      className="group"
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100">
                        {/* Icon area */}
                        <div className={`relative aspect-[4/3] bg-gradient-to-br ${t.gradient} flex items-center justify-center overflow-hidden`}>
                          {/* Desert pattern overlay */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute bottom-0 left-0 right-0">
                              <svg viewBox="0 0 200 40" className="w-full" preserveAspectRatio="none">
                                <path fill="white" d="M0,20 Q25,5 50,18 Q75,30 100,15 Q125,5 150,20 Q175,30 200,12 L200,40 L0,40Z" />
                              </svg>
                            </div>
                          </div>

                          <motion.span
                            className="text-6xl sm:text-7xl drop-shadow-lg relative z-10"
                            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.4 }}
                          >
                            {game.icon}
                          </motion.span>

                          {/* Play overlay on hover */}
                          {!game.isComingSoon && playUrl !== '#' && (
                            <a
                              href={playUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300 z-20"
                            >
                              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
                                <span className="text-amber-600 text-xl font-black mr-[-2px]">▶</span>
                              </div>
                            </a>
                          )}

                          {/* Category badge */}
                          <div className="absolute top-2 right-2 z-10">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm ${t.badge}`}>
                              {game.category}
                            </span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <h3 className="text-sm font-black text-gray-800 leading-snug mb-1 line-clamp-2">{game.title}</h3>
                          <p className="text-xs text-gray-400 line-clamp-1 mb-3">{game.description}</p>

                          {game.isComingSoon ? (
                            <div className="w-full py-2 bg-gray-100 text-gray-400 rounded-xl text-xs font-bold text-center">
                              قريباً 🚀
                            </div>
                          ) : playUrl !== '#' ? (
                            <a
                              href={playUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block w-full py-2 bg-gradient-to-r ${t.gradient} text-white rounded-xl text-xs font-bold text-center hover:shadow-lg transition-all active:scale-95`}
                            >
                              العب الآن 🎮
                            </a>
                          ) : (
                            <div className="w-full py-2 bg-gray-100 text-gray-400 rounded-xl text-xs font-bold text-center">
                              غير متاح
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Fahd's tip */}
      <section className="relative z-10 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-3xl p-6 md:p-8 text-center border-4 border-amber-300 shadow-2xl"
          >
            <span className="text-5xl block mb-3">🦁</span>
            <h3 className="text-2xl font-black text-white mb-2">نصيحة فهد</h3>
            <p className="text-amber-100 font-bold text-lg leading-relaxed">
              العب وتعلّم كل يوم شيئاً جديداً! كل لعبة هنا تقوّي عقلك وتنمّي مهاراتك.
              <br />
              <span className="text-yellow-300">استمتع بالتعلم في واحة الألعاب! 🌴</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Visitor Counter */}
      <section className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <VisitorCounter pageName="الألعاب" pageRoute="/games" />
        </div>
      </section>
    </main>
  );
}
