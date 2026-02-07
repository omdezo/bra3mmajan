"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const flowers = [
    { id: 1, verse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", color: "from-pink-400 to-pink-600", position: { bottom: "25%", left: "10%" } },
    { id: 2, verse: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", color: "from-purple-400 to-purple-600", position: { bottom: "45%", left: "25%" } },
    { id: 3, verse: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", color: "from-blue-400 to-blue-600", position: { bottom: "20%", right: "25%" } }, // Moved left to avoid Noor
    { id: 4, verse: "وَقُل رَّبِّ زِدْنِي عِلْمًا", color: "from-green-400 to-green-600", position: { bottom: "50%", left: "60%" } },
    { id: 5, verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", color: "from-yellow-400 to-yellow-600", position: { bottom: "35%", right: "45%" } },
];

export function OasisSection() {
    const containerRef = useRef(null);
    const [bloomedFlowers, setBloomedFlowers] = useState<number[]>([]);
    const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

    // Hydration fix: Generate stars only on client
    const [stars, setStars] = useState<{ id: number; top: number; left: number; duration: number }[]>([]);

    useEffect(() => {
        setStars(Array.from({ length: 10 }).map((_, i) => ({
            id: i,
            top: Math.random() * 40,
            left: Math.random() * 100,
            duration: Math.random() * 2 + 2
        })));
    }, []);

    const handleFlowerClick = (id: number) => {
        if (!bloomedFlowers.includes(id)) {
            setBloomedFlowers([...bloomedFlowers, id]);
        }
        setSelectedVerse(id);
    };

    return (
        <section ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-teal-900 via-emerald-800 to-green-700 overflow-hidden flex flex-col items-center justify-center">

            {/* Night Sky Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-transparent" />

            {/* Stars */}
            <div className="absolute inset-0 pointer-events-none">
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                        style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            willChange: 'opacity'
                        }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                        transition={{ duration: star.duration, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Crescent Moon */}
            <motion.div
                className="absolute top-10 left-10 md:left-20 z-10 w-24 h-24 md:w-32 md:h-32"
                animate={{ rotate: [0, 5, 0], y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <Image
                    src="/assets/moon.svg"
                    alt="Moon"
                    fill
                    className="object-contain drop-shadow-[0_0_30px_rgba(253,224,71,0.6)]"
                />
            </motion.div>

            {/* Title & Info - Centered */}
            <div className="absolute top-[12%] w-full flex justify-center z-40 pointer-events-none">
                <div className="bg-gradient-to-br from-green-600/90 to-emerald-700/90 backdrop-blur-md text-white px-8 md:px-12 py-6 rounded-3xl border-4 border-green-400 shadow-2xl max-w-lg text-center pointer-events-auto transform hover:scale-105 transition-transform" dir="rtl">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg text-yellow-100">حديقة القرآن 🌸</h2>
                    <p className="text-lg md:text-xl font-bold leading-relaxed drop-shadow mb-6 text-green-50">
                        اضغط على الزهور لتتفتح وتكشف عن آيات وأدعية جميلة!
                    </p>
                    <Link
                        href="/oasis"
                        className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 font-bold px-8 py-3 rounded-full hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg active:scale-95 text-lg ring-4 ring-yellow-200/50"
                    >
                        زيارة الواحة 🌙
                    </Link>
                </div>
            </div>

            {/* Garden Ground - Hill Effect */}
            <div className="absolute bottom-0 w-full h-[50%] bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] from-green-800 via-green-900 to-teal-950" />

            {/* Texture Overlay */}
            <div className="absolute bottom-0 w-full h-[50%] opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grass.png')] mix-blend-overlay" />

            {/* Water Stream */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-blue-500/40 via-cyan-400/30 to-transparent z-10 blur-sm"
            />

            {/* Noor Character */}
            <motion.div
                className="absolute bottom-[10%] right-[5%] md:right-[15%] z-30 w-40 h-52 md:w-56 md:h-72 drop-shadow-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <Image
                    src="/assets/نور.png"
                    alt="نور"
                    fill
                    className="object-contain"
                    priority
                />
            </motion.div>

            {/* Interactive Flowers - SVG Assets */}
            {flowers.map((flower, index) => {
                const isBloom = bloomedFlowers.includes(flower.id);
                return (
                    <motion.div
                        key={flower.id}
                        className="absolute z-20 cursor-pointer"
                        style={{ ...flower.position }}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: isBloom ? 1.2 : 1,
                            y: isBloom ? -10 : 0
                        }}
                        transition={{
                            scale: { type: "spring", bounce: 0.5 },
                            y: { duration: 0.5 }
                        }}
                        onClick={() => handleFlowerClick(flower.id)}
                        whileHover={{ scale: isBloom ? 1.3 : 1.1, rotate: isBloom ? 5 : -5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <div className="relative w-24 h-24 md:w-32 md:h-32">
                            <Image
                                src={isBloom ? "/assets/flower_bloom.svg" : "/assets/flower_bud.svg"}
                                alt="Flower"
                                fill
                                className={`object-contain transition-all duration-500 ${isBloom ? 'drop-shadow-[0_0_15px_rgba(255,105,180,0.8)]' : 'drop-shadow-lg'}`}
                            />
                        </div>

                        {/* Hint for first flower */}
                        {!isBloom && bloomedFlowers.length === 0 && index === 0 && (
                            <motion.div
                                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border-2 border-yellow-600 shadow-xl"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                اضغط هنا! 🌸
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
