"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Calculator, Languages, Puzzle, Brain, Trophy, Star, Zap, Heart, Sparkles, ArrowRight } from "lucide-react";
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

const ICON_MAP: Record<string, React.ElementType> = {
  'الحساب': Calculator,
  'اللغة العربية': Languages,
  'الألغاز': Puzzle,
  'الذاكرة': Brain,
}

const BG_COLORS = [
  'bg-gradient-to-br from-blue-100 to-blue-200',
  'bg-gradient-to-br from-green-100 to-green-200',
  'bg-gradient-to-br from-purple-100 to-purple-200',
  'bg-gradient-to-br from-pink-100 to-pink-200',
  'bg-gradient-to-br from-yellow-100 to-yellow-200',
]

const GRADIENT_COLORS = [
  'from-blue-500 to-blue-700',
  'from-green-500 to-green-700',
  'from-purple-500 to-purple-700',
  'from-pink-500 to-pink-700',
  'from-yellow-500 to-yellow-700',
]

const STATIC_GAMES: ApiGame[] = [
  { _id: '1', title: 'ألعاب الحساب', description: 'تعلم الأرقام والعمليات الحسابية بطريقة ممتعة مع فهد!', category: 'الحساب', difficulty: 'سهل', icon: '🔢', color: '#3B82F6', stars: 3, playersCount: 1234, isComingSoon: true, isExternalLink: false },
  { _id: '2', title: 'ألعاب اللغة العربية', description: 'اكتشف جمال اللغة العربية من خلال الألعاب التفاعلية!', category: 'اللغة العربية', difficulty: 'متوسط', icon: '📝', color: '#10B981', stars: 4, playersCount: 987, isComingSoon: true, isExternalLink: false },
  { _id: '3', title: 'الألغاز الذكية', description: 'حل الألغاز وطور مهارات التفكير والمنطق!', category: 'الألغاز', difficulty: 'صعب', icon: '🧩', color: '#8B5CF6', stars: 5, playersCount: 756, isComingSoon: true, isExternalLink: false },
  { _id: '4', title: 'ألعاب الذاكرة', description: 'قوِّ ذاكرتك وتركيزك مع تحديات مثيرة!', category: 'الذاكرة', difficulty: 'سهل', icon: '🧠', color: '#EC4899', stars: 3, playersCount: 1456, isComingSoon: true, isExternalLink: false },
]

const achievements = [
  { id: 1, title: 'بطل المبتدئين', icon: '🏅', unlocked: true },
  { id: 2, title: 'عبقري الحساب', icon: '🧮', unlocked: true },
  { id: 3, title: 'ماهر اللغة', icon: '📝', unlocked: false },
  { id: 4, title: 'محترف الألغاز', icon: '🧩', unlocked: false },
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [games, setGames] = useState<ApiGame[]>(STATIC_GAMES);

  useEffect(() => {
    fetch('/api/games?limit=20')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setGames(d.data) })
      .catch(() => {})
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500 relative overflow-hidden" dir="rtl">
      <Navbar />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${(i * 37 + 13) % 100}%`, top: `${(i * 47 + 23) % 100}%` }}
            animate={{ y: [0, -30, 0], rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: (i % 5) + 5, repeat: Infinity, ease: "linear" }}
          >
            {['⭐', '🎮', '🏆', '💎', '🎯'][i % 5]}
          </motion.div>
        ))}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
      </div>

      {/* Header Section */}
      <section className="relative z-10 pt-8 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/#games" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-bold px-6 py-3 rounded-full hover:bg-white/30 transition-all mb-8 group">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <motion.div className="relative" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
              <motion.div className="relative w-80 h-80 md:w-96 md:h-96" animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Image src="/assets/فهد.png" alt="فهد" fill className="object-contain drop-shadow-2xl" />
                <motion.div className="absolute -top-10 -right-10 text-6xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🎮</motion.div>
                <motion.div className="absolute -bottom-10 -left-10 text-6xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>⚡</motion.div>
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-20 -z-10" />
            </motion.div>

            <div className="flex-1 text-center md:text-right">
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="text-6xl md:text-8xl font-black mb-4">
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 text-transparent bg-clip-text drop-shadow-lg">حديقة الألعاب</span>
                </h1>
                <div className="inline-block bg-white/20 backdrop-blur-md rounded-3xl px-8 py-4 mb-6">
                  <p className="text-3xl font-black text-white drop-shadow-lg">مع فَهد 🦁 الشبل النشيط</p>
                </div>
                <p className="text-xl md:text-2xl text-white font-bold leading-relaxed mb-8 drop-shadow-lg">
                  استعد للمغامرة! ألعاب تعليمية تفاعلية ممتعة تنمي المهارات العقلية
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border-2 border-white/30">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-300" />
                      <div className="text-right"><p className="text-sm text-white/80">مستواك</p><p className="text-2xl font-black text-white">مبتدئ نشيط</p></div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border-2 border-white/30">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-300" />
                      <div className="text-right"><p className="text-sm text-white/80">الألعاب المتاحة</p><p className="text-2xl font-black text-white">{games.length}</p></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="text-5xl font-black text-center text-white mb-12 drop-shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            اختر لعبتك المفضلة! 🎯
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {games.map((game, index) => {
              const IconComponent = ICON_MAP[game.category] ?? Calculator
              const bgColor = BG_COLORS[index % BG_COLORS.length]
              const gradColor = GRADIENT_COLORS[index % GRADIENT_COLORS.length]
              return (
                <motion.div
                  key={game._id}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredGame(game._id)}
                  onHoverEnd={() => setHoveredGame(null)}
                  onClick={() => !game.isExternalLink && setSelectedGame(selectedGame === game._id ? null : game._id)}
                  className="cursor-pointer group relative"
                >
                  <motion.div
                    className={`${bgColor} rounded-3xl p-8 border-4 border-white shadow-2xl relative overflow-hidden`}
                    whileHover={{ scale: 1.05, rotate: hoveredGame === game._id ? 2 : 0 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div className={`absolute inset-0 bg-gradient-to-br ${gradColor} opacity-0 group-hover:opacity-20 transition-opacity`} />

                    {hoveredGame === game._id && (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <motion.div key={i} className="absolute text-3xl" style={{ left: `${(i * 25 + 10) % 90}%`, top: `${(i * 30 + 15) % 80}%` }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0], y: [0, -50] }}
                            transition={{ duration: 1, delay: i * 0.1 }}>✨</motion.div>
                        ))}
                      </>
                    )}

                    <motion.div
                      className={`w-24 h-24 bg-gradient-to-br ${gradColor} rounded-2xl flex items-center justify-center mb-6 relative`}
                      animate={hoveredGame === game._id ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-5xl">{game.icon}</span>
                      <motion.div className={`absolute inset-0 bg-gradient-to-br ${gradColor} rounded-2xl blur-xl opacity-50`} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    </motion.div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-3xl font-black text-gray-800 mb-1">{game.title}</h3>
                          <p className="text-lg font-bold text-gray-600">{game.category}</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-full border-2 border-blue-400">
                          <span className="text-sm font-black text-gray-700">{game.difficulty}</span>
                        </div>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">{game.description}</p>
                      <div className="flex items-center gap-6 mb-6">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < game.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Heart className="w-5 h-5" />
                          <span className="font-bold">{game.playersCount.toLocaleString('ar')} لاعب</span>
                        </div>
                      </div>
                      {game.isComingSoon ? (
                        <motion.button
                          disabled
                          className={`w-full bg-gray-300 text-gray-500 font-black text-xl px-8 py-4 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center gap-3 cursor-not-allowed`}
                        >
                          <span>قريباً 🚀</span>
                        </motion.button>
                      ) : game.isExternalLink && game.externalLink ? (
                        <motion.a
                          href={game.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full bg-gradient-to-r ${gradColor} text-white font-black text-xl px-8 py-4 rounded-2xl shadow-lg border-4 border-white hover:shadow-2xl transition-all flex items-center justify-center gap-3 group/btn`}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        >
                          <Zap className="w-6 h-6 group-hover/btn:animate-bounce" />
                          <span>العب الآن!</span>
                          <span className="text-sm opacity-80">↗</span>
                        </motion.a>
                      ) : (
                        <motion.button
                          className={`w-full bg-gradient-to-r ${gradColor} text-white font-black text-xl px-8 py-4 rounded-2xl shadow-lg border-4 border-white hover:shadow-2xl transition-all flex items-center justify-center gap-3 group/btn`}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        >
                          <Zap className="w-6 h-6 group-hover/btn:animate-bounce" />
                          <span>العب الآن!</span>
                          <Sparkles className="w-6 h-6 group-hover/btn:animate-spin" />
                        </motion.button>
                      )}
                    </div>

                    {game.isComingSoon && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-sm border-4 border-yellow-600 shadow-lg rotate-12">
                        قريباً 🚀
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-white/30">
            <h2 className="text-4xl font-black text-white mb-8 text-center flex items-center justify-center gap-4">
              <Trophy className="w-10 h-10 text-yellow-300" /><span>إنجازاتك 🏆</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((a) => (
                <motion.div
                  key={a.id}
                  className={`${a.unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-400' : 'bg-gray-400'} rounded-2xl p-6 text-center relative overflow-hidden border-4 border-white`}
                  whileHover={{ scale: a.unlocked ? 1.1 : 1 }}
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: a.id * 0.1 }}
                >
                  {!a.unlocked && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-4xl">🔒</span></div>}
                  <div className="text-5xl mb-3">{a.icon}</div>
                  <p className="text-sm font-black text-white">{a.title}</p>
                  {a.unlocked && <motion.div className="absolute top-2 right-2 text-2xl" animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity }}>✨</motion.div>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visitor Counter */}
      <section className="py-8 px-4 bg-gradient-to-b from-orange-100 to-amber-100">
        <div className="max-w-6xl mx-auto flex justify-center">
          <VisitorCounter pageName="الألعاب" pageRoute="/games" />
        </div>
      </section>
    </main>
  );
}
