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
        <section ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100 overflow-hidden flex items-center justify-center perspective-1000">

            {/* Sky Background with Clouds */}
            <div className="absolute inset-0">
                {/* Floating Clouds */}
                <motion.div
                    className="absolute top-10 left-[10%] w-40 h-20 md:w-64 md:h-32 bg-white/70 blur-xl rounded-full"
                    animate={{ x: [-100, 100, -100] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute top-[30%] right-[15%] w-32 h-16 md:w-48 md:h-24 bg-white/60 blur-xl rounded-full"
                    animate={{ x: [100, -100, 100] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute top-[50%] left-[30%] w-48 h-24 md:w-72 md:h-36 bg-white/50 blur-xl rounded-full"
                    animate={{ x: [-50, 50, -50] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Mountain Range at Bottom */}
            <div className="absolute bottom-0 w-full h-[30%] opacity-30">
                <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="none">
                    <path d="M0,300 L0,200 L200,100 L400,150 L600,50 L800,120 L1000,80 L1200,180 L1200,300 Z" fill="#8B4513" opacity="0.6" />
                    <path d="M0,300 L0,250 L150,180 L350,220 L550,150 L750,200 L950,170 L1200,220 L1200,300 Z" fill="#A0522D" opacity="0.5" />
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

            {/* Collectible Items */}
            {collectibles.map((item, index) => (
                !collectedItems.includes(item.id) && (
                    <motion.div
                        key={item.id}
                        className="absolute z-20 cursor-pointer"
                        style={{ ...item.position, willChange: 'transform' }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 1,
                            scale: [1, 1.2, 1],
                            y: [0, -15, 0]
                        }}
                        transition={{
                            opacity: { delay: index * 0.2 },
                            scale: { duration: 2, repeat: Infinity, delay: index * 0.3 },
                            y: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                        }}
                        onClick={() => handleCollect(item.id, item.points)}
                        whileHover={{ scale: 1.5, rotate: 360 }}
                        whileTap={{ scale: 0.5 }}
                    >
                        <div className="relative">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur rounded-full border-4 border-yellow-400 shadow-2xl flex items-center justify-center">
                                <span className="text-3xl md:text-4xl">{item.icon}</span>
                            </div>
                            {/* Points Badge */}
                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-white font-black text-xs px-2 py-1 rounded-full border-2 border-yellow-600">
                                +{item.points}
                            </div>
                        </div>
                    </motion.div>
                )
            ))}

            {/* Score HUD */}
            <div className="absolute top-20 md:top-10 left-4 md:left-10 z-40 bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-2xl border-4 border-sky-500 shadow-xl" dir="rtl">
                <div className="flex items-center gap-4">
                    <div className="text-4xl">🎯</div>
                    <div>
                        <p className="text-sm text-sky-600 font-bold">النقاط</p>
                        <p className="text-3xl md:text-4xl font-black text-sky-700">{totalScore}</p>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <div className="text-2xl">💎</div>
                    <div className="flex-1 bg-sky-100 rounded-full h-3 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(collectedItems.length / collectibles.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <span className="text-sm font-bold text-sky-700">{collectedItems.length}/{collectibles.length}</span>
                </div>
            </div>

            {/* Game Info Card */}
            <div className="absolute bottom-6 md:bottom-10 right-4 md:right-10 z-40 bg-gradient-to-br from-sky-600 to-blue-700 text-white p-4 md:p-6 rounded-2xl border-4 border-sky-400 shadow-xl max-w-xs" dir="rtl">
                <h2 className="text-2xl md:text-3xl font-black mb-2 drop-shadow-lg">تحليق الصقر</h2>
                <p className="text-sm md:text-base font-bold leading-snug mb-3">
                    حلق مع سيف فوق جبال عُمان!
                    <br />
                    <span className="text-yellow-300">اجمع كل الكنوز لتفوز! 🏆</span>
                </p>
                <Link
                    href="/challenges"
                    className="block text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-sky-900 font-bold px-6 py-3 rounded-full hover:from-yellow-500 hover:to-orange-500 transition-all shadow-lg active:scale-95"
                >
                    المزيد من التحديات 🦅
                </Link>
            </div>

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
