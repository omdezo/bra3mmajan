"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const flowers = [
    { id: 1, verse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", color: "from-pink-400 to-pink-600", position: { bottom: "25%", left: "15%" } },
    { id: 2, verse: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", color: "from-purple-400 to-purple-600", position: { bottom: "30%", left: "40%" } },
    { id: 3, verse: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", color: "from-blue-400 to-blue-600", position: { bottom: "20%", right: "20%" } },
    { id: 4, verse: "وَقُل رَّبِّ زِدْنِي عِلْمًا", color: "from-green-400 to-green-600", position: { bottom: "35%", left: "60%" } },
    { id: 5, verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", color: "from-yellow-400 to-yellow-600", position: { bottom: "28%", right: "45%" } },
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

            {/* Crescent Moon and Star */}
            <motion.div
                className="absolute top-10 left-10 md:left-20 z-10"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                <div className="relative w-16 h-16 md:w-24 md:h-24">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full shadow-[0_0_30px_rgba(253,224,71,0.8)]" />
                    <div className="absolute top-1 right-2 w-[80%] h-[80%] bg-gradient-to-b from-teal-900 via-emerald-800 to-green-700 rounded-full" />
                </div>
                <motion.div
                    className="absolute -right-8 top-2 text-yellow-300 text-2xl md:text-3xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                    ⭐
                </motion.div>
            </motion.div>

            {/* Garden Ground */}
            <div className="absolute bottom-0 w-full h-[45%] bg-gradient-to-t from-green-900 via-green-800 to-transparent" />
            <div className="absolute bottom-0 w-full h-[40%] opacity-30">
                {/* Grass texture */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(34,197,94,0.3) 2px, rgba(34,197,94,0.3) 4px)',
                }} />
            </div>

            {/* Water Stream */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-r from-blue-400/20 via-cyan-300/30 to-blue-400/20 z-10"
                animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% 100%' }}
            />

            {/* Noor Character */}
            <motion.div
                className="absolute bottom-[15%] right-[5%] md:right-[10%] z-30 w-32 h-40 md:w-48 md:h-56"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <Image
                    src="/assets/نور.png"
                    alt="نور"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                />
            </motion.div>

            {/* Interactive Flowers */}
            {flowers.map((flower, index) => {
                const isBloom = bloomedFlowers.includes(flower.id);
                return (
                    <motion.div
                        key={flower.id}
                        className="absolute z-20 cursor-pointer"
                        style={{ ...flower.position, willChange: 'transform' }}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{
                            scale: isBloom ? 1 : 0.7,
                            rotate: isBloom ? 0 : [0, -5, 5, 0],
                        }}
                        transition={{
                            scale: { delay: index * 0.2, type: "spring" },
                            rotate: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                        }}
                        onClick={() => handleFlowerClick(flower.id)}
                        whileHover={{ scale: isBloom ? 1.2 : 0.9 }}
                        whileTap={{ scale: 0.6 }}
                    >
                        {/* Stem */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-16 md:h-24 bg-green-600 rounded-full" />

                        {/* Flower Petals */}
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute top-1/2 left-1/2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br ${flower.color} rounded-full shadow-lg`}
                                    style={{
                                        transformOrigin: 'center',
                                        transform: `rotate(${i * 60}deg) translateY(-${isBloom ? '14px' : '10px'})`,
                                    }}
                                    animate={isBloom ? {
                                        scale: [1, 1.2, 1],
                                    } : {}}
                                    transition={{ duration: 0.3 }}
                                />
                            ))}
                            {/* Center */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 bg-yellow-400 rounded-full shadow-lg border-2 border-yellow-500" />
                        </div>

                        {/* Sparkle when bloomed */}
                        {isBloom && (
                            <motion.div
                                className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 text-2xl"
                                initial={{ scale: 0, rotate: 0 }}
                                animate={{ scale: [0, 1.5, 0], rotate: [0, 180, 360] }}
                                transition={{ duration: 1 }}
                            >
                                ✨
                            </motion.div>
                        )}

                        {/* Hint */}
                        {!isBloom && bloomedFlowers.length === 0 && index === 0 && (
                            <motion.div
                                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-900 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                اضغط على الزهرة! 🌸
                            </motion.div>
                        )}
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

            {/* Title & Info */}
            <div className="absolute top-16 md:top-10 left-4 md:left-10 z-40 bg-gradient-to-br from-green-600 to-emerald-700 text-white px-6 md:px-10 py-4 md:py-5 rounded-3xl border-4 border-green-400 shadow-2xl max-w-sm" dir="rtl">
                <h2 className="text-3xl md:text-4xl font-black mb-2 drop-shadow-lg">حديقة القرآن 🌸</h2>
                <p className="text-base md:text-lg font-bold leading-snug drop-shadow mb-4">
                    اضغط على الزهور لتتفتح وتكشف عن آيات وأدعية جميلة!
                </p>
                <Link
                    href="/oasis"
                    className="block text-center bg-gradient-to-r from-yellow-400 to-green-400 text-green-900 font-bold px-6 py-3 rounded-full hover:from-yellow-500 hover:to-green-500 transition-all shadow-lg active:scale-95"
                >
                    زيارة الواحة 🌙
                </Link>
            </div>

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
