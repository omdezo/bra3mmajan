"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export function WatchSection() {
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPopcorn, setShowPopcorn] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true);
        setShowPopcorn(true);
    };

    return (
        <section ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden flex items-center justify-center perspective-1000">

            {/* Cinema Curtains */}
            <div className="absolute inset-0 flex justify-between pointer-events-none z-40">
                {/* Left Curtain */}
                <motion.div
                    className="w-[15%] md:w-[10%] h-full bg-gradient-to-r from-red-900 to-red-800 shadow-2xl relative"
                    initial={{ x: 0 }}
                    animate={{ x: isPlaying ? -100 : 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <div className="absolute right-0 top-0 h-full w-4 bg-red-950 skew-x-6" />
                </motion.div>

                {/* Right Curtain */}
                <motion.div
                    className="w-[15%] md:w-[10%] h-full bg-gradient-to-l from-red-900 to-red-800 shadow-2xl relative"
                    initial={{ x: 0 }}
                    animate={{ x: isPlaying ? 100 : 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <div className="absolute left-0 top-0 h-full w-4 bg-red-950 -skew-x-6" />
                </motion.div>

                {/* Top Valance */}
                <div className="absolute top-0 w-full h-16 md:h-24 bg-gradient-to-b from-red-800 to-red-700 rounded-b-[50%] shadow-xl flex justify-center items-end pb-2 md:pb-4">
                    <span className="text-2xl md:text-3xl text-yellow-400 font-serif tracking-widest drop-shadow-md">سينما براعم</span>
                </div>
            </div>

            {/* The Screen */}
            <motion.div
                className="relative w-[85%] md:w-[70vw] h-[50vh] md:h-[40vw] max-h-[70vh] bg-black border-[8px] md:border-[16px] border-gray-800 rounded-lg shadow-[0_0_100px_rgba(255,255,255,0.2)] overflow-hidden z-10"
                animate={{
                    scale: isPlaying ? 1.05 : 1,
                    filter: isPlaying ? 'brightness(1.2)' : 'brightness(0.8)'
                }}
                transition={{ duration: 0.5 }}
            >
                {/* Movie Content */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
                    {!isPlaying ? (
                        <div className="text-center" dir="rtl">
                            <motion.div
                                className="text-6xl md:text-8xl mb-6"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                ▶️
                            </motion.div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">قريباً</h2>
                            <p className="text-gray-300 mt-4 text-xl md:text-2xl font-bold">مغامرات شيقة مع فرح!</p>
                            <motion.button
                                onClick={handlePlay}
                                className="mt-8 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-black text-lg md:text-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all shadow-2xl"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                شغل الفيلم! 🎬
                            </motion.button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center" dir="rtl"
                        >
                            <div className="text-5xl md:text-7xl mb-4">🎬</div>
                            <h3 className="text-3xl md:text-5xl font-black text-white mb-4">الآن يعرض...</h3>
                            <motion.div
                                className="text-4xl md:text-6xl"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                🎥
                            </motion.div>
                            <p className="text-xl md:text-2xl text-purple-300 mt-6 font-bold">مغامرة فرح المثيرة!</p>
                        </motion.div>
                    )}

                    {/* Scanlines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-30" />
                </div>

                {/* Lulwah Character */}
                <motion.div
                    className="absolute bottom-0 left-10 md:left-10 w-32 h-32 md:w-40 md:h-40 z-10"
                    initial={{ y: 100 }}
                    animate={{ y: isPlaying ? -20 : 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    <Image
                        src="/assets/فرح.png"
                        alt="فرح"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </motion.div>
            </motion.div>

            {/* Popcorn Explosion */}
            {showPopcorn && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-x-0 bottom-0 h-[50vh] pointer-events-none z-30 flex flex-wrap justify-center content-end overflow-hidden"
                    style={{ willChange: 'transform' }}
                >
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="relative w-10 h-10 md:w-12 md:h-12 m-1 md:m-2"
                            initial={{ y: 0, rotate: 0 }}
                            animate={{
                                y: [0, -Math.random() * 100, 0],
                                rotate: [0, Math.random() * 360, 0]
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random()
                            }}
                        >
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-sm">
                                <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10 Z" fill="#FEF3C7" />
                                <path d="M30 30 C20 40 20 60 30 70" fill="none" stroke="#FDE68A" strokeWidth="5" />
                                <path d="M70 30 C80 40 80 60 70 70" fill="none" stroke="#FDE68A" strokeWidth="5" />
                            </svg>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Popcorn Bucket (Foreground) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-50 w-48 h-56 md:w-64 md:h-64 translate-y-10">
                <div className="w-full h-full relative">
                    {/* Bucket */}
                    <div className="absolute bottom-0 w-full h-[70%] bg-gradient-to-br from-red-500 to-red-700 clip-path-bucket shadow-2xl border-4 border-red-800" />

                    {/* Stripes */}
                    <div className="absolute bottom-0 w-full h-[70%] clip-path-bucket overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-full h-8 bg-white/30"
                                style={{ bottom: `${i * 16}%`, transform: 'skewY(-2deg)' }}
                            />
                        ))}
                    </div>

                    {/* Label */}
                    <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 bg-white px-4 md:px-6 py-2 md:py-3 font-black text-red-700 text-xl md:text-2xl rotate-[-3deg] border-4 border-red-700 rounded-lg shadow-xl">
                        فوشار! 🍿
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="absolute top-1/3 right-4 md:right-10 z-40 max-w-xs bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border-4 border-purple-500 shadow-2xl" dir="rtl">
                <h2 className="text-3xl md:text-4xl font-black text-purple-200 mb-3">قاعة المشاهدة</h2>
                <p className="text-base md:text-lg text-purple-100 font-bold leading-snug mb-4">
                    استمتع بمشاهدة أجمل القصص والمغامرات التعليمية!
                </p>
                {!isPlaying && (
                    <motion.div
                        className="bg-purple-800/50 border-2 border-purple-400 rounded-xl p-3 mb-4"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <p className="text-sm font-bold text-purple-200 text-center">
                            👈 اضغط على الشاشة للمشاهدة!
                        </p>
                    </motion.div>
                )}
                <Link
                    href="/watch"
                    className="block text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg active:scale-95"
                >
                    شاهد المزيد 📺
                </Link>
            </div>

        </section>
    );
}
