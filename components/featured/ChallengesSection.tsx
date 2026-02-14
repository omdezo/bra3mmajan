"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const collectibles = [
    { id: 1, icon: "📜", points: 100, position: { top: "25%", left: "20%" } },
    { id: 2, icon: "💎", points: 150, position: { top: "35%", right: "25%" } },
    { id: 3, icon: "⭐", points: 200, position: { top: "45%", left: "40%" } },
    { id: 4, icon: "🏆", points: 250, position: { top: "30%", left: "60%" } },
    { id: 5, icon: "💫", points: 300, position: { top: "50%", right: "35%" } },
];

export function ChallengesSection() {
    const containerRef = useRef(null);
    const [collectedItems, setCollectedItems] = useState<number[]>([]);
    const [totalScore, setTotalScore] = useState(0);
    const [isFlying, setIsFlying] = useState(false);

    const handleCollect = (id: number, points: number) => {
        if (!collectedItems.includes(id)) {
            setCollectedItems([...collectedItems, id]);
            setTotalScore(totalScore + points);
        }
    };

    return (
        <section ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-sky-500 via-cyan-400 to-amber-200 overflow-hidden flex items-center justify-center perspective-1000">

            {/* Animated Sun */}
            <motion.div
                className="absolute top-12 right-16 w-24 h-24 md:w-32 md:h-32 bg-yellow-300 rounded-full shadow-[0_0_80px_rgba(253,224,71,0.8)]"
                animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                        '0 0 80px rgba(253,224,71,0.8)',
                        '0 0 100px rgba(253,224,71,1)',
                        '0 0 80px rgba(253,224,71,0.8)'
                    ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 to-orange-400" />
            </motion.div>

            {/* Enhanced Sky with Clouds */}
            <div className="absolute inset-0">
                {/* Floating Clouds */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute bg-white/70 blur-xl rounded-full`}
                        style={{
                            top: `${15 + i * 12}%`,
                            left: `${i % 2 === 0 ? 10 + i * 15 : 70 - i * 10}%`,
                            width: `${120 + i * 30}px`,
                            height: `${60 + i * 15}px`
                        }}
                        animate={{
                            x: i % 2 === 0 ? [-100, 100, -100] : [100, -100, 100],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 20 + i * 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Desert Mountains at Bottom */}
            <div className="absolute bottom-0 w-full h-[35%]">
                <svg viewBox="0 0 1200 350" className="w-full h-full" preserveAspectRatio="none">
                    {/* Back mountains */}
                    <path d="M0,350 L0,220 L200,120 L400,170 L600,80 L800,140 L1000,100 L1200,200 L1200,350 Z"
                        fill="#D4A574" opacity="0.7" />
                    {/* Middle mountains */}
                    <path d="M0,350 L0,260 L150,190 L350,230 L550,170 L750,210 L950,180 L1200,240 L1200,350 Z"
                        fill="#C19A6B" opacity="0.8" />
                    {/* Front mountains */}
                    <path d="M0,350 L0,290 L180,240 L380,270 L580,220 L780,260 L980,240 L1200,280 L1200,350 Z"
                        fill="#B8956A" opacity="0.9" />
                </svg>
            </div>

            {/* Saif (The Falcon) - Interactive */}
            <motion.div
                className="relative z-30 w-40 h-40 md:w-56 md:h-56 drop-shadow-2xl cursor-pointer"
                animate={isFlying ? {
                    y: [0, -30, 0],
                    rotate: [-5, 5, -5]
                } : {
                    rotate: [-2, 2, -2]
                }}
                transition={isFlying ? {
                    duration: 1,
                    repeat: 3
                } : {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                onClick={() => setIsFlying(true)}
                onAnimationComplete={() => setIsFlying(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Image
                    src="/assets/سيف.png"
                    alt="سيف الصقر"
                    fill
                    className="object-contain"
                    priority
                />
                {/* Click Hint */}
                {collectedItems.length === 0 && (
                    <motion.div
                        className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-sky-700 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        اضغط عليّ! 👆
                    </motion.div>
                )}
            </motion.div>

            {/* Enhanced Collectible Items */}
            {collectibles.map((item, index) => (
                !collectedItems.includes(item.id) && (
                    <motion.div
                        key={item.id}
                        className="absolute z-20 cursor-pointer"
                        style={{ ...item.position, willChange: 'transform' }}
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{
                            opacity: 1,
                            scale: [1, 1.15, 1],
                            y: [0, -20, 0],
                            rotate: 0
                        }}
                        transition={{
                            opacity: { delay: index * 0.2 },
                            rotate: { delay: index * 0.2, duration: 0.6 },
                            scale: { duration: 2.5, repeat: Infinity, delay: index * 0.4 },
                            y: { duration: 2.5, repeat: Infinity, delay: index * 0.4, ease: "easeInOut" }
                        }}
                        onClick={() => handleCollect(item.id, item.points)}
                        whileHover={{ scale: 1.6, rotate: 360 }}
                        whileTap={{ scale: 0.5 }}
                    >
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 bg-yellow-300/40 rounded-full blur-xl" />

                            {/* Main badge */}
                            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-white to-yellow-50 backdrop-blur rounded-full border-4 border-yellow-400 shadow-[0_8px_25px_rgba(0,0,0,0.3)] flex items-center justify-center">
                                <span className="text-4xl md:text-5xl drop-shadow-lg">{item.icon}</span>

                                {/* Sparkle effect */}
                                <motion.div
                                    className="absolute -top-1 -right-1 text-yellow-300 text-xl"
                                    animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    ✨
                                </motion.div>
                            </div>

                            {/* Points Badge */}
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-sm px-3 py-1.5 rounded-full border-3 border-white shadow-lg">
                                +{item.points}
                            </div>
                        </div>
                    </motion.div>
                )
            ))}

            {/* Enhanced Score HUD */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-24 md:top-20 left-4 md:left-8 z-40 bg-gradient-to-br from-white to-blue-50 backdrop-blur-xl p-5 md:p-6 rounded-3xl border-4 border-blue-400 shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                dir="rtl"
            >
                <div className="flex items-center gap-4 mb-4">
                    <motion.div
                        className="text-5xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🎯
                    </motion.div>
                    <div>
                        <p className="text-sm text-blue-600 font-bold">النقاط</p>
                        <motion.p
                            className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                            key={totalScore}
                            initial={{ scale: 1.5 }}
                            animate={{ scale: 1 }}
                        >
                            {totalScore}
                        </motion.p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-3">
                    <div className="text-3xl">💎</div>
                    <div className="flex-1">
                        <div className="bg-white rounded-full h-4 overflow-hidden shadow-inner border-2 border-blue-200">
                            <motion.div
                                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full rounded-full relative"
                                initial={{ width: 0 }}
                                animate={{ width: `${(collectedItems.length / collectibles.length) * 100}%` }}
                                transition={{ duration: 0.5, type: "spring" }}
                            >
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                            </motion.div>
                        </div>
                        <p className="text-xs font-bold text-blue-600 mt-1 text-center">
                            {collectedItems.length}/{collectibles.length} كنز
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Game Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 md:bottom-10 right-4 md:right-10 z-40 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white p-6 md:p-8 rounded-3xl border-4 border-cyan-300 shadow-[0_12px_40px_rgba(0,0,0,0.2)] max-w-sm"
                dir="rtl"
            >
                {/* Decorative stars */}
                <div className="absolute -top-2 -right-2 text-yellow-300 text-3xl animate-spin-slow">⭐</div>
                <div className="absolute -bottom-2 -left-2 text-yellow-300 text-2xl animate-pulse">🌟</div>

                <h2 className="text-3xl md:text-4xl font-black mb-3 drop-shadow-lg flex items-center gap-2">
                    <span>🦅</span>
                    <span>تحليق الصقر</span>
                </h2>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
                    <p className="text-base md:text-lg font-bold leading-relaxed">
                        حلق مع سيف فوق جبال عُمان الشامخة!
                        <br />
                        <span className="text-yellow-300 text-xl">✨ اجمع كل الكنوز لتفوز! 🏆</span>
                    </p>
                </div>
                <Link
                    href="/challenges"
                    className="block text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-blue-900 font-black px-8 py-4 rounded-full hover:from-yellow-300 hover:via-orange-300 hover:to-yellow-400 transition-all shadow-[0_6px_20px_rgba(251,191,36,0.5)] hover:shadow-[0_8px_30px_rgba(251,191,36,0.7)] active:scale-95 text-lg border-2 border-yellow-300"
                >
                    المزيد من التحديات 🎯
                </Link>
            </motion.div>

            {/* Victory Screen */}
            {collectedItems.length === collectibles.length && (
                <motion.div
                    className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-yellow-400/95 to-orange-500/95 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <motion.div
                        className="bg-white p-10 md:p-16 rounded-3xl border-8 border-yellow-400 shadow-2xl text-center"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.5, repeat: 3 }}
                        dir="rtl"
                    >
                        <div className="text-8xl md:text-9xl mb-6">🎉</div>
                        <h3 className="text-4xl md:text-5xl font-black text-orange-600 mb-4">مبروك!</h3>
                        <p className="text-2xl md:text-3xl font-bold text-orange-800 mb-6">
                            أكملت التحدي بنجاح!
                        </p>
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full text-3xl font-black mb-6">
                            {totalScore} نقطة 🏆
                        </div>
                        <button
                            onClick={() => {
                                setCollectedItems([]);
                                setTotalScore(0);
                            }}
                            className="px-10 py-4 bg-orange-500 text-white rounded-full font-bold text-xl hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all shadow-lg active:scale-95"
                        >
                            العب مرة أخرى
                        </button>
                    </motion.div>
                </motion.div>
            )}

        </section>
    );
}
