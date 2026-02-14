"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const storyBooks = [
    { id: 1, title: "حكاية الصياد", color: "from-blue-500 to-blue-700", bgColor: "bg-blue-600", angle: 0 },
    { id: 2, title: "أسطورة الجبل", color: "from-green-500 to-green-700", bgColor: "bg-green-600", angle: 72 },
    { id: 3, title: "قصة البحار", color: "from-purple-500 to-purple-700", bgColor: "bg-purple-600", angle: 144 },
    { id: 4, title: "حكايات الصحراء", color: "from-orange-500 to-orange-700", bgColor: "bg-orange-600", angle: 216 },
    { id: 5, title: "سر الواحة", color: "from-pink-500 to-pink-700", bgColor: "bg-pink-600", angle: 288 },
];

export function StoriesSection() {
    const containerRef = useRef(null);
    const [selectedStory, setSelectedStory] = useState<number | null>(null);

    // Hydration fix: Generate stars only on client
    const [stars, setStars] = useState<{ id: number; top: number; left: number; duration: number }[]>([]);

    // Hydration fix: Generate particles only on client
    const [particles, setParticles] = useState<{ id: number; left: number; top: number }[]>([]);

    useEffect(() => {
        setStars(Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            top: Math.random() * 60,
            left: Math.random() * 100,
            duration: Math.random() * 3 + 2
        })));

        setParticles(Array.from({ length: 6 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100
        })));
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 overflow-hidden flex items-center justify-center">

            {/* Enhanced Starry Night Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.3),transparent_60%)]" />

            {/* Magical Glow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.15),transparent_40%)]" />

            {/* Enhanced Twinkling Stars */}
            <div className="absolute inset-0 pointer-events-none">
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute rounded-full"
                        style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            width: star.id % 3 === 0 ? '3px' : '2px',
                            height: star.id % 3 === 0 ? '3px' : '2px',
                            background: star.id % 2 === 0 ? '#FEF08A' : '#FFFFFF',
                            willChange: 'opacity',
                            boxShadow: '0 0 4px rgba(254, 240, 138, 0.8)'
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: star.duration, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Crescent Moon - Enhanced */}
            <motion.div
                className="absolute top-8 right-8 md:top-12 md:right-16 w-24 h-24 md:w-40 md:h-40 z-20"
                animate={{
                    rotate: [0, 8, 0],
                    y: [0, -10, 0]
                }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full shadow-[0_0_60px_rgba(253,224,71,0.8),0_0_100px_rgba(253,224,71,0.4)]" />
                    <div className="absolute top-2 right-4 w-[80%] h-[80%] bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 rounded-full" />
                </div>
            </motion.div>

            {/* The Majestic Ancient Sidr Tree - Centerpiece */}
            <motion.div
                className="absolute bottom-0 z-10 w-full h-[70vh] md:h-[75vh]"
                animate={{ rotate: [-0.3, 0.3, -0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: 0.5, originY: 1 }}
            >
                <Image
                    src="/assets/sidr_tree.png"
                    alt="شجرة السدر"
                    fill
                    className="object-contain drop-shadow-[0_0_50px_rgba(34,197,94,0.3)]"
                    priority
                />
            </motion.div>

            {/* Ground/Base for the scene */}
            <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-emerald-900/60 via-green-800/40 to-transparent z-[5]" />
            <div className="absolute bottom-0 w-full h-2 bg-green-950/80 z-[5]" />

            {/* Grandpa Salem - Close to the tree */}
            <motion.div
                className="absolute bottom-12 left-[35%] md:left-[38%] z-30 w-44 h-44 md:w-56 md:h-56"
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <Image
                    src="/assets/جدّي سالم.png"
                    alt="الجد سالم"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                />
                {/* Glow effect around grandpa */}
                <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full blur-2xl" />
            </motion.div>

            {/* Orbiting Story Books - Beautiful 3D Books */}
            {storyBooks.map((book, index) => {
                const radius = 280; // orbit radius in pixels - increased for more space
                const centerX = 50; // center of screen %
                const centerY = 45; // center of screen %

                return (
                    <motion.div
                        key={book.id}
                        className="absolute z-30 cursor-pointer"
                        style={{
                            left: `calc(${centerX}% + ${Math.cos((book.angle * Math.PI) / 180) * radius}px)`,
                            top: `calc(${centerY}% + ${Math.sin((book.angle * Math.PI) / 180) * radius}px)`,
                            willChange: 'transform'
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: selectedStory === book.id ? 0 : 1,
                            scale: selectedStory === book.id ? 0 : 1,
                            y: [0, -15, 0],
                        }}
                        transition={{
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.3 },
                            y: {
                                duration: 3 + index * 0.3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.2
                            }
                        }}
                        onClick={() => setSelectedStory(book.id)}
                        whileHover={{
                            scale: 1.3,
                            rotate: -5,
                            z: 50,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {/* 3D Book Design */}
                        <div className="relative" style={{ perspective: '1000px' }}>
                            {/* Book Cover */}
                            <div className={`relative w-24 h-32 md:w-28 md:h-36 bg-gradient-to-br ${book.color} rounded-r-lg shadow-2xl border-l-4 border-yellow-400`}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset -2px 0 8px rgba(0,0,0,0.3)'
                                }}
                            >
                                {/* Book spine */}
                                <div className={`absolute left-0 top-0 w-2 h-full ${book.bgColor} rounded-l-sm`}
                                    style={{
                                        transform: 'translateX(-100%)',
                                        boxShadow: '-2px 0 6px rgba(0,0,0,0.4)'
                                    }}
                                />

                                {/* Decorative frame */}
                                <div className="absolute inset-3 border-2 border-yellow-200/40 rounded" />

                                {/* Book icon/design */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                    <div className="text-4xl mb-1 drop-shadow-lg">📖</div>
                                    <div className="w-12 h-0.5 bg-yellow-300/60 rounded mx-auto" />
                                </div>

                                {/* Pages effect */}
                                <div className="absolute right-0 top-1 bottom-1 w-1 bg-white/90 rounded-r-sm" />
                                <div className="absolute right-0.5 top-2 bottom-2 w-0.5 bg-white/70" />

                                {/* Magical sparkle */}
                                <motion.div
                                    className="absolute -top-3 -right-3 text-yellow-300 text-2xl drop-shadow-lg"
                                    animate={{
                                        scale: [1, 1.4, 1],
                                        rotate: [0, 180, 360],
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                >
                                    ✨
                                </motion.div>

                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-r-lg bg-gradient-to-tl from-yellow-200/20 to-transparent" />
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            {/* Story Preview Modal */}
            {selectedStory !== null && (
                <motion.div
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedStory(null)}
                >
                    <motion.div
                        className="bg-gradient-to-br from-yellow-100 to-amber-100 p-8 md:p-12 rounded-3xl border-8 border-yellow-500 shadow-2xl max-w-md mx-4"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                        dir="rtl"
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-3xl md:text-4xl font-black text-amber-900 mb-4">
                                {storyBooks.find(b => b.id === selectedStory)?.title}
                            </h3>
                            <p className="text-lg md:text-xl text-amber-800 font-bold mb-6 leading-relaxed">
                                كان يا ما كان، في قديم الزمان... قصة رائعة من تراثنا العريق!
                            </p>
                            <button
                                onClick={() => setSelectedStory(null)}
                                className="px-8 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all shadow-lg active:scale-95"
                            >
                                أغلق
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Enhanced Section Title & Info Card */}
            <motion.div
                className="absolute top-[25%] right-[3%] md:right-[5%] z-40 text-right max-w-xs md:max-w-sm"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                dir="rtl"
            >
                <div className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl border-4 border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.3)] overflow-hidden">
                    {/* Decorative corner stars */}
                    <div className="absolute top-2 right-2 text-yellow-300 text-xl">⭐</div>
                    <div className="absolute bottom-2 left-2 text-yellow-300 text-xl">⭐</div>

                    {/* Animated book icon */}
                    <motion.div
                        className="text-6xl mb-4 text-center"
                        animate={{
                            rotateY: [0, 20, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        📚
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black text-yellow-300 mb-4 text-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] tracking-wide">
                        مكتبة النجوم
                    </h2>

                    <div className="bg-indigo-950/50 rounded-2xl p-4 mb-5 border-2 border-purple-500/30">
                        <p className="text-base md:text-lg text-purple-100 leading-relaxed font-bold mb-2">
                            تحت سماء الليل المرصعة بالنجوم، يروي <span className="text-yellow-300">الجد سالم</span> حكايات الأمس.
                        </p>
                        <p className="text-yellow-200 font-bold text-center text-lg">
                            اضغط على كتاب لتقرأ القصة! ✨
                        </p>
                    </div>

                    <Link
                        href="/stories"
                        className="block text-center bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-purple-900 font-black px-8 py-4 rounded-full hover:from-yellow-300 hover:via-amber-400 hover:to-yellow-300 transition-all shadow-[0_8px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_12px_30px_rgba(234,179,8,0.6)] active:scale-95 text-lg border-2 border-yellow-600"
                    >
                        زيارة المكتبة 📚
                    </Link>

                    {/* Magical particles effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                        {particles.map((particle, i) => (
                            <motion.div
                                key={particle.id}
                                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                                style={{
                                    left: `${particle.left}%`,
                                    top: `${particle.top}%`,
                                }}
                                animate={{
                                    y: [0, -20, 0],
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.5
                                }}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Magical Reading Progress */}
            <motion.div
                className="absolute top-[25%] left-[3%] md:left-[5%] z-40"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
            >
                <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-500 px-6 py-4 rounded-2xl border-4 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.5)]" dir="rtl">
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="text-4xl"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            📖
                        </motion.div>
                        <div>
                            <p className="text-sm font-bold text-amber-900">الكتب المقروءة</p>
                            <p className="text-2xl font-black text-purple-900">
                                {storyBooks.filter(b => selectedStory === b.id).length} / {storyBooks.length}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

        </section>
    );
}
