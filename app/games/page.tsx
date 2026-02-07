"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Calculator, Languages, Puzzle, Brain, Trophy, Star, Zap, Heart, Sparkles, ArrowRight } from "lucide-react";

const games = [
    {
        id: 1,
        title: "ألعاب الحساب",
        subtitle: "مغامرة الأرقام",
        icon: Calculator,
        description: "تعلم الأرقام والعمليات الحسابية بطريقة ممتعة مع فهد!",
        color: "from-blue-500 to-blue-700",
        bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
        accentColor: "blue",
        difficulty: "سهل",
        stars: 3,
        players: "1,234"
    },
    {
        id: 2,
        title: "ألعاب اللغة العربية",
        subtitle: "رحلة الحروف",
        icon: Languages,
        description: "اكتشف جمال اللغة العربية من خلال الألعاب التفاعلية!",
        color: "from-green-500 to-green-700",
        bgColor: "bg-gradient-to-br from-green-100 to-green-200",
        accentColor: "green",
        difficulty: "متوسط",
        stars: 4,
        players: "987"
    },
    {
        id: 3,
        title: "الألغاز الذكية",
        subtitle: "تحدي العقول",
        icon: Puzzle,
        description: "حل الألغاز وطور مهارات التفكير والمنطق!",
        color: "from-purple-500 to-purple-700",
        bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
        accentColor: "purple",
        difficulty: "صعب",
        stars: 5,
        players: "756"
    },
    {
        id: 4,
        title: "ألعاب الذاكرة",
        subtitle: "قوة التركيز",
        icon: Brain,
        description: "قوِّ ذاكرتك وتركيزك مع تحديات مثيرة!",
        color: "from-pink-500 to-pink-700",
        bgColor: "bg-gradient-to-br from-pink-100 to-pink-200",
        accentColor: "pink",
        difficulty: "سهل",
        stars: 3,
        players: "1,456"
    }
];

const achievements = [
    { id: 1, title: "بطل المبتدئين", icon: "🏅", unlocked: true },
    { id: 2, title: "عبقري الحساب", icon: "🧮", unlocked: true },
    { id: 3, title: "ماهر اللغة", icon: "📝", unlocked: false },
    { id: 4, title: "محترف الألغاز", icon: "🧩", unlocked: false },
];

export default function GamesPage() {
    const [selectedGame, setSelectedGame] = useState<number | null>(null);
    const [hoveredGame, setHoveredGame] = useState<number | null>(null);

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500 relative overflow-hidden" dir="rtl">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Shapes */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 360],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {['⭐', '🎮', '🏆', '💎', '🎯'][i % 5]}
                    </motion.div>
                ))}

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }} />
                </div>
            </div>

            {/* Header Section */}
            <section className="relative z-10 pt-8 pb-12 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Back Button */}
                    <Link
                        href="/#games"
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-bold px-6 py-3 rounded-full hover:bg-white/30 transition-all mb-8 group"
                    >
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        <span>العودة للرئيسية</span>
                    </Link>

                    {/* Title Section with Character */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">

                        {/* Fahd Character - Large and Animated */}
                        <motion.div
                            className="relative"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <motion.div
                                className="relative w-80 h-80 md:w-96 md:h-96"
                                animate={{
                                    y: [0, -20, 0],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Image
                                    src="/assets/فهد.png"
                                    alt="فهد"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                />

                                {/* Playful Elements Around Fahd */}
                                <motion.div
                                    className="absolute -top-10 -right-10 text-6xl"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    🎮
                                </motion.div>
                                <motion.div
                                    className="absolute -bottom-10 -left-10 text-6xl"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    ⚡
                                </motion.div>
                            </motion.div>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-20 -z-10" />
                        </motion.div>

                        {/* Title and Stats */}
                        <div className="flex-1 text-center md:text-right">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="text-6xl md:text-8xl font-black mb-4">
                                    <span className="bg-gradient-to-r from-yellow-300 to-orange-300 text-transparent bg-clip-text drop-shadow-lg">
                                        حديقة الألعاب
                                    </span>
                                </h1>

                                <div className="inline-block bg-white/20 backdrop-blur-md rounded-3xl px-8 py-4 mb-6">
                                    <p className="text-3xl font-black text-white drop-shadow-lg">
                                        مع فَهد 🦁 الشبل النشيط
                                    </p>
                                </div>

                                <p className="text-xl md:text-2xl text-white font-bold leading-relaxed mb-8 drop-shadow-lg">
                                    استعد للمغامرة! ألعاب تعليمية تفاعلية ممتعة تنمي المهارات العقلية
                                </p>

                                {/* Player Stats */}
                                <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                                    <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border-2 border-white/30">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="w-6 h-6 text-yellow-300" />
                                            <div className="text-right">
                                                <p className="text-sm text-white/80">مستواك</p>
                                                <p className="text-2xl font-black text-white">مبتدئ نشيط</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border-2 border-white/30">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-6 h-6 text-yellow-300" />
                                            <div className="text-right">
                                                <p className="text-sm text-white/80">النقاط</p>
                                                <p className="text-2xl font-black text-white">0</p>
                                            </div>
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

                    <motion.h2
                        className="text-5xl font-black text-center text-white mb-12 drop-shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        اختر لعبتك المفضلة! 🎯
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {games.map((game, index) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                onHoverStart={() => setHoveredGame(game.id)}
                                onHoverEnd={() => setHoveredGame(null)}
                                onClick={() => setSelectedGame(selectedGame === game.id ? null : game.id)}
                                className="cursor-pointer group relative"
                            >
                                {/* Game Card */}
                                <motion.div
                                    className={`${game.bgColor} rounded-3xl p-8 border-4 border-white shadow-2xl relative overflow-hidden`}
                                    whileHover={{ scale: 1.05, rotate: hoveredGame === game.id ? 2 : 0 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {/* Animated Background Gradient */}
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                                    />

                                    {/* Sparkle Effects on Hover */}
                                    {hoveredGame === game.id && (
                                        <>
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute text-3xl"
                                                    style={{
                                                        left: `${Math.random() * 100}%`,
                                                        top: `${Math.random() * 100}%`,
                                                    }}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{
                                                        scale: [0, 1.5, 0],
                                                        opacity: [0, 1, 0],
                                                        y: [0, -50]
                                                    }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                >
                                                    ✨
                                                </motion.div>
                                            ))}
                                        </>
                                    )}

                                    {/* Icon */}
                                    <motion.div
                                        className={`w-24 h-24 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center mb-6 relative`}
                                        animate={hoveredGame === game.id ? {
                                            rotate: [0, -10, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        } : {}}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <game.icon className="w-12 h-12 text-white" />

                                        {/* Glow Effect */}
                                        <motion.div
                                            className={`absolute inset-0 bg-gradient-to-br ${game.color} rounded-2xl blur-xl opacity-50`}
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-3xl font-black text-gray-800 mb-1">{game.title}</h3>
                                                <p className="text-lg font-bold text-gray-600">{game.subtitle}</p>
                                            </div>

                                            {/* Difficulty Badge */}
                                            <div className={`bg-white px-4 py-2 rounded-full border-2 border-${game.accentColor}-400`}>
                                                <span className="text-sm font-black text-gray-700">{game.difficulty}</span>
                                            </div>
                                        </div>

                                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                            {game.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center gap-6 mb-6">
                                            {/* Star Rating */}
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < game.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Players */}
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Heart className="w-5 h-5" />
                                                <span className="font-bold">{game.players} لاعب</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <motion.button
                                            className={`w-full bg-gradient-to-r ${game.color} text-white font-black text-xl px-8 py-4 rounded-2xl shadow-lg border-4 border-white hover:shadow-2xl transition-all flex items-center justify-center gap-3 group/btn`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Zap className="w-6 h-6 group-hover/btn:animate-bounce" />
                                            <span>العب الآن!</span>
                                            <Sparkles className="w-6 h-6 group-hover/btn:animate-spin" />
                                        </motion.button>
                                    </div>

                                    {/* Coming Soon Badge */}
                                    <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-sm border-4 border-yellow-600 shadow-lg rotate-12">
                                        قريباً 🚀
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements Section */}
            <section className="relative z-10 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-white/30">
                        <h2 className="text-4xl font-black text-white mb-8 text-center flex items-center justify-center gap-4">
                            <Trophy className="w-10 h-10 text-yellow-300" />
                            <span>إنجازاتك 🏆</span>
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {achievements.map((achievement) => (
                                <motion.div
                                    key={achievement.id}
                                    className={`${achievement.unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-400' : 'bg-gray-400'} rounded-2xl p-6 text-center relative overflow-hidden border-4 border-white`}
                                    whileHover={{ scale: achievement.unlocked ? 1.1 : 1 }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: achievement.id * 0.1 }}
                                >
                                    {!achievement.unlocked && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-4xl">🔒</span>
                                        </div>
                                    )}

                                    <div className="text-5xl mb-3">{achievement.icon}</div>
                                    <p className="text-sm font-black text-white">{achievement.title}</p>

                                    {achievement.unlocked && (
                                        <motion.div
                                            className="absolute top-2 right-2 text-2xl"
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            ✨
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Fahd's Tip Section */}
            <section className="relative z-10 py-12 px-4 mb-16">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl p-8 md:p-12 border-8 border-white shadow-2xl relative overflow-hidden"
                    >
                        {/* Animated Background */}
                        <motion.div
                            className="absolute inset-0 opacity-20"
                            animate={{
                                backgroundPosition: ['0% 0%', '100% 100%'],
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            style={{
                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                                backgroundSize: '200% 200%',
                            }}
                        />

                        <div className="relative z-10 text-center">
                            <div className="text-6xl mb-4">💡</div>
                            <h3 className="text-4xl font-black text-white mb-4">نصيحة من فهد!</h3>
                            <p className="text-2xl text-white font-bold leading-relaxed">
                                العب كل يوم لمدة 15 دقيقة وستصبح بطلاً في كل الألعاب!
                                <br />
                                التحدي والمرح ينتظرانك! 🦁⚡
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

        </main>
    );
}
