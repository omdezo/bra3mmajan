"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const flowers = [
    { id: 1, verse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", color: "from-pink-400 to-pink-600", position: { bottom: "18%", left: "12%" } },
    { id: 2, verse: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", color: "from-purple-400 to-purple-600", position: { bottom: "22%", left: "28%" } },
    { id: 3, verse: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", color: "from-blue-400 to-blue-600", position: { bottom: "20%", left: "45%" } },
    { id: 4, verse: "وَقُل رَّبِّ زِدْنِي عِلْمًا", color: "from-green-400 to-green-600", position: { bottom: "25%", left: "62%" } },
    { id: 5, verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", color: "from-yellow-400 to-yellow-600", position: { bottom: "18%", right: "8%" } },
];

export function OasisSection() {
    const containerRef = useRef(null);
    const [bloomedFlowers, setBloomedFlowers] = useState<number[]>([]);
    const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

    // Hydration fix: Generate stars only on client
    const [stars, setStars] = useState<{ id: number; top: number; left: number; duration: number }[]>([]);

    // Hydration fix: Generate stones only on client
    const [stones, setStones] = useState<{ id: number; bottom: number; left: number; width: number; height: number }[]>([]);

    useEffect(() => {
        setStars(Array.from({ length: 10 }).map((_, i) => ({
            id: i,
            top: Math.random() * 40,
            left: Math.random() * 100,
            duration: Math.random() * 2 + 2
        })));

        setStones(Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            bottom: 10 + Math.random() * 20,
            left: 10 + i * 10,
            width: 8 + Math.random() * 8,
            height: 6 + Math.random() * 6
        })));
    }, []);

    const handleFlowerClick = (id: number) => {
        if (!bloomedFlowers.includes(id)) {
            setBloomedFlowers([...bloomedFlowers, id]);
        }
        setSelectedVerse(id);
    };

    return (
        <section ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-indigo-950 via-teal-900 to-emerald-800 overflow-hidden flex flex-col items-center justify-center">

            {/* Enhanced Night Sky Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-teal-900/50 to-transparent" />

            {/* Enhanced Twinkling Stars */}
            <div className="absolute inset-0 pointer-events-none">
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute rounded-full"
                        style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            width: star.id % 3 === 0 ? '4px' : '2px',
                            height: star.id % 3 === 0 ? '4px' : '2px',
                            background: star.id % 2 === 0 ? '#FEF08A' : '#FFFFFF',
                            willChange: 'opacity',
                            boxShadow: '0 0 6px rgba(254,240,138,0.9)'
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.4, 1]
                        }}
                        transition={{ duration: star.duration, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Enhanced Glowing Crescent Moon */}
            <motion.div
                className="absolute top-8 left-8 md:left-16 z-10 w-32 h-32 md:w-40 md:h-40"
                animate={{
                    rotate: [0, 8, 0],
                    y: [0, -12, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/assets/moon.svg"
                        alt="Moon"
                        fill
                        className="object-contain drop-shadow-[0_0_50px_rgba(253,224,71,1)]"
                    />
                    {/* Extra glow */}
                    <div className="absolute inset-0 bg-yellow-300/20 rounded-full blur-3xl" />
                </div>
            </motion.div>

            {/* Enhanced Title & Info Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute top-[12%] w-full flex justify-center z-40 pointer-events-none"
            >
                <div className="relative bg-gradient-to-br from-emerald-500/95 via-green-600/95 to-teal-600/95 backdrop-blur-xl text-white px-10 md:px-14 py-8 rounded-[2rem] border-4 border-yellow-300 shadow-[0_0_40px_rgba(34,197,94,0.4)] max-w-2xl text-center pointer-events-auto" dir="rtl">
                    {/* Decorative stars */}
                    <div className="absolute -top-3 -right-3 text-yellow-300 text-4xl animate-pulse">🌟</div>
                    <div className="absolute -top-3 -left-3 text-yellow-300 text-3xl animate-bounce">✨</div>

                    {/* Title with glow */}
                    <motion.h2
                        className="text-5xl md:text-6xl font-black mb-4 drop-shadow-[0_0_20px_rgba(253,224,71,0.6)] text-yellow-100"
                        animate={{ textShadow: ['0 0 20px rgba(253,224,71,0.6)', '0 0 30px rgba(253,224,71,0.9)', '0 0 20px rgba(253,224,71,0.6)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🌸 حديقة القرآن 🌸
                    </motion.h2>

                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 mb-6">
                        <p className="text-xl md:text-2xl font-bold leading-relaxed text-emerald-50">
                            اضغط على الزهور لتتفتح وتكشف عن <span className="text-yellow-300">آيات وأدعية جميلة</span>!
                        </p>
                    </div>

                    <Link
                        href="/oasis"
                        className="inline-block bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-green-900 font-black px-10 py-4 rounded-full hover:from-yellow-300 hover:via-amber-300 hover:to-yellow-400 transition-all shadow-[0_8px_25px_rgba(251,191,36,0.5)] hover:shadow-[0_10px_35px_rgba(251,191,36,0.7)] active:scale-95 text-xl border-4 border-yellow-300"
                    >
                        زيارة الواحة 🌙
                    </Link>
                </div>
            </motion.div>

            {/* Enhanced Garden Ground with layers */}
            <div className="absolute bottom-0 w-full h-[55%] bg-gradient-to-b from-transparent via-green-900/50 to-green-950" />
            <div className="absolute bottom-0 w-full h-[50%] bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] from-emerald-700 via-green-900 to-teal-950" />

            {/* Grass texture */}
            <div className="absolute bottom-0 w-full h-[50%] opacity-30 bg-[url('https://www.transparenttextures.com/patterns/grass.png')] mix-blend-overlay" />

            {/* Garden Bed - Beautiful Flower Garden */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] z-[15]">
                {/* Main garden soil */}
                <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-amber-900 via-amber-800 to-green-900 rounded-t-[50%]" />

                {/* Garden border - decorative edge */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-700 via-yellow-700 to-amber-700 rounded-t-lg" />

                {/* Grass on top of soil */}
                <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-green-700 via-green-800 to-transparent opacity-80" />

                {/* Small decorative stones */}
                {stones.map((stone) => (
                    <div
                        key={stone.id}
                        className="absolute rounded-full bg-gray-500"
                        style={{
                            bottom: `${stone.bottom}%`,
                            left: `${stone.left}%`,
                            width: `${stone.width}px`,
                            height: `${stone.height}px`,
                            opacity: 0.4
                        }}
                    />
                ))}
            </div>

            {/* Enhanced Flowing Water Stream */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[18%] z-10"
                style={{
                    background: 'linear-gradient(to top, rgba(59, 130, 246, 0.5), rgba(34, 211, 238, 0.35), transparent)'
                }}
            >
                {/* Water ripples */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bottom-0 left-0 right-0 h-full"
                        style={{
                            background: `radial-gradient(ellipse at ${30 + i * 20}% 100%, rgba(56, 189, 248, 0.3) 0%, transparent 60%)`,
                        }}
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.8
                        }}
                    />
                ))}
            </motion.div>


            {/* Enhanced Noor Character with Glow */}
            <motion.div
                className="absolute bottom-[10%] right-[5%] md:right-[12%] z-30 w-48 h-56 md:w-64 md:h-80"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-radial from-yellow-300/30 via-green-300/20 to-transparent rounded-full blur-3xl scale-150" />

                <Image
                    src="/assets/نور.png"
                    alt="نور"
                    fill
                    className="object-contain drop-shadow-[0_10px_40px_rgba(34,197,94,0.4)]"
                    priority
                />
            </motion.div>

            {/* Enhanced Interactive Flowers */}
            {flowers.map((flower, index) => {
                const isBloom = bloomedFlowers.includes(flower.id);
                return (
                    <motion.div
                        key={flower.id}
                        className="absolute z-20 cursor-pointer"
                        style={{ ...flower.position }}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{
                            scale: isBloom ? 1.3 : 1,
                            y: isBloom ? -10 : 0,
                            rotate: 0
                        }}
                        transition={{
                            scale: { type: "spring", bounce: 0.6 },
                            y: { duration: 0.5 },
                            rotate: { duration: 0.6, delay: index * 0.1 }
                        }}
                        onClick={() => handleFlowerClick(flower.id)}
                        whileHover={{ scale: isBloom ? 1.4 : 1.15, rotate: isBloom ? 10 : -8 }}
                        whileTap={{ scale: 0.85 }}
                    >
                        <div className="relative">
                            {/* Glow effect for bloomed flowers */}
                            {isBloom && (
                                <motion.div
                                    className={`absolute inset-0 w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br ${flower.color} opacity-40 rounded-full blur-2xl`}
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}

                            <div className="relative w-28 h-28 md:w-36 md:h-36">
                                <Image
                                    src={isBloom ? "/assets/flower_bloom.svg" : "/assets/flower_bud.svg"}
                                    alt="Flower"
                                    fill
                                    className={`object-contain transition-all duration-500 ${isBloom ? 'drop-shadow-[0_0_20px_rgba(255,105,180,1)] brightness-110' : 'drop-shadow-xl'}`}
                                />

                                {/* Sparkles for bloomed flowers */}
                                {isBloom && (
                                    <>
                                        <motion.div
                                            className="absolute -top-2 -right-2 text-yellow-300 text-2xl"
                                            animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            ✨
                                        </motion.div>
                                        <motion.div
                                            className="absolute -bottom-2 -left-2 text-pink-300 text-xl"
                                            animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                        >
                                            🌟
                                        </motion.div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Hint for first flower */}
                        {!isBloom && bloomedFlowers.length === 0 && index === 0 && (
                            <motion.div
                                className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-yellow-900 px-6 py-3 rounded-2xl text-base md:text-lg font-black whitespace-nowrap border-4 border-yellow-300 shadow-[0_8px_25px_rgba(251,191,36,0.6)]"
                                animate={{
                                    y: [0, -12, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                👆 اضغط هنا! 🌸
                            </motion.div>
                        )}

                        {/* Sparkles on Bloom */}
                        <AnimatePresence>
                            {isBloom && (
                                <motion.div
                                    className="absolute inset-0 pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-2 h-2 bg-yellow-200 rounded-full"
                                            initial={{ x: 0, y: 0, opacity: 1 }}
                                            animate={{
                                                x: (Math.random() - 0.5) * 100,
                                                y: (Math.random() - 0.5) * 100,
                                                opacity: 0
                                            }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            style={{ left: '50%', top: '50%' }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}

            {/* Verse Display Modal */}
            {selectedVerse !== null && (
                <motion.div
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedVerse(null)}
                >
                    <motion.div
                        className="bg-gradient-to-br from-emerald-100 to-teal-100 p-8 md:p-12 rounded-3xl border-8 border-green-500 shadow-2xl max-w-lg mx-4"
                        initial={{ scale: 0, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                        dir="rtl"
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-6">🌺</div>
                            <div className="bg-white/80 p-6 rounded-2xl border-4 border-green-400 mb-6">
                                <p className="text-2xl md:text-3xl font-bold text-green-900 leading-relaxed">
                                    {flowers.find(f => f.id === selectedVerse)?.verse}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedVerse(null)}
                                className="px-8 py-3 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all shadow-lg active:scale-95"
                            >
                                إغلاق
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}



            {/* Progress Counter */}
            {bloomedFlowers.length > 0 && (
                <div className="absolute top-16 md:top-10 right-4 md:right-10 z-40 bg-white/95 backdrop-blur px-6 py-3 rounded-full border-4 border-green-500 shadow-xl" dir="rtl">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🌺</span>
                        <div>
                            <p className="text-sm text-green-700 font-bold">الزهور المتفتحة</p>
                            <p className="text-2xl font-black text-green-800">{bloomedFlowers.length} / {flowers.length}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Achievement */}
            {bloomedFlowers.length === flowers.length && (
                <motion.div
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-10 py-4 rounded-full border-6 border-yellow-300 shadow-[0_0_30px_rgba(253,224,71,0.8)]"
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    dir="rtl"
                >
                    <p className="text-2xl md:text-3xl font-black drop-shadow-lg">
                        🎉 ماشاء الله! كل الزهور تفتحت! 🎉
                    </p>
                </motion.div>
            )}

        </section>
    );
}
