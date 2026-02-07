"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const storyBooks = [
    { id: 1, title: "حكاية الصياد", color: "from-blue-500 to-blue-700", position: { top: "20%", left: "15%" } },
    { id: 2, title: "أسطورة الجبل", color: "from-green-500 to-green-700", position: { top: "15%", left: "45%" } },
    { id: 3, title: "قصة البحار", color: "from-purple-500 to-purple-700", position: { top: "25%", left: "70%" } },
    { id: 4, title: "حكايات الصحراء", color: "from-orange-500 to-orange-700", position: { top: "40%", left: "25%" } },
    { id: 5, title: "سر الواحة", color: "from-pink-500 to-pink-700", position: { top: "35%", left: "60%" } },
];

export function StoriesSection() {
    const containerRef = useRef(null);
    const [selectedStory, setSelectedStory] = useState<number | null>(null);

    // Hydration fix: Generate stars only on client
    const [stars, setStars] = useState<{ id: number; top: number; left: number; duration: number }[]>([]);

    useEffect(() => {
        setStars(Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            top: Math.random() * 60,
            left: Math.random() * 100,
            duration: Math.random() * 3 + 2
        })));
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 overflow-hidden flex flex-col items-center justify-center pb-0">

            {/* Background: Starry Night Sky */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_70%)]" />

            {/* Twinkling Stars */}
            <div className="absolute inset-0 pointer-events-none">
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            willChange: 'opacity'
                        }}
                        animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                        transition={{ duration: star.duration, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Crescent Moon */}
            <motion.div
                className="absolute top-10 right-10 md:right-20 w-20 h-20 md:w-32 md:h-32"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-yellow-200 rounded-full shadow-[0_0_40px_rgba(253,224,71,0.6)]" />
                    <div className="absolute top-1 right-3 w-[85%] h-[85%] bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 rounded-full" />
                </div>
            </motion.div>

            {/* The Ancient Sidr Tree (Smaller, at bottom) */}
            <motion.div
                className="absolute bottom-0 z-10 w-[80vw] md:w-[50vw] h-[30vh] md:h-[40vh]"
                animate={{ rotate: [-0.5, 0.5, -0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: 0.5, originY: 1 }}
            >
                <Image
                    src="/assets/sidr_tree.png"
                    alt="شجرة السدر"
                    fill
                    className="object-contain drop-shadow-2xl opacity-80"
                    priority
                />
            </motion.div>

            {/* Grandpa Salem */}
            <div className="absolute bottom-5 left-[10%] md:left-[15%] z-20 w-32 h-32 md:w-48 md:h-48">
                <Image
                    src="/assets/جدّي سالم.png"
                    alt="الجد سالم"
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                />
            </div>

            {/* Floating Story Books */}
            {storyBooks.map((book, index) => (
                <motion.div
                    key={book.id}
                    className={`absolute z-30 cursor-pointer`}
                    style={{ top: book.position.top, left: book.position.left, willChange: 'transform' }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                        opacity: selectedStory === book.id ? 0 : 1,
                        y: selectedStory === book.id ? -100 : [0, -20, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        opacity: { duration: 0.3 },
                        y: { duration: 3, repeat: Infinity, delay: index * 0.3 },
                        rotate: { duration: 4, repeat: Infinity, delay: index * 0.2 }
                    }}
                    onClick={() => setSelectedStory(book.id)}
                    whileHover={{ scale: 1.2, rotate: 0 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {/* Book */}
                    <div className={`relative w-20 h-28 md:w-24 md:h-32 bg-gradient-to-br ${book.color} rounded-lg shadow-2xl border-4 border-yellow-200`}>
                        <div className="absolute inset-2 border-2 border-yellow-100/30 rounded" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl">📖</div>
                        {/* Sparkle Effect */}
                        <motion.div
                            className="absolute -top-2 -right-2 text-yellow-300 text-xl"
                            animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ✨
                        </motion.div>
                    </div>
                </motion.div>
            ))}

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

            {/* Section Title & Info */}
            <div className="absolute top-[10%] right-[5%] md:right-[10%] z-30 text-right text-white max-w-xs md:max-w-sm bg-indigo-900/50 backdrop-blur-md p-4 md:p-6 rounded-2xl border-2 border-yellow-400/50" dir="rtl">
                <h2 className="text-3xl md:text-4xl font-serif text-yellow-300 mb-3 drop-shadow-lg">مكتبة النجوم</h2>
                <p className="text-base md:text-lg text-yellow-100 leading-relaxed font-bold drop-shadow-lg mb-4">
                    تحت سماء الليل المرصعة بالنجوم، يروي الجد سالم حكايات الأمس.
                    <br />
                    <span className="text-yellow-300">اضغط على كتاب لتقرأ القصة! ✨</span>
                </p>
                <Link
                    href="/stories"
                    className="block text-center bg-gradient-to-r from-yellow-500 to-amber-500 text-indigo-900 font-bold px-6 py-3 rounded-full hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg active:scale-95"
                >
                    زيارة المكتبة 📚
                </Link>
            </div>

            {/* Achievement Counter */}
            {storyBooks.filter(b => selectedStory === b.id).length > 0 && (
                <div className="absolute bottom-20 left-4 md:left-10 z-40 bg-yellow-500/90 backdrop-blur px-6 py-3 rounded-full border-4 border-yellow-300 shadow-xl" dir="rtl">
                    <p className="text-lg md:text-xl font-black text-yellow-900">
                        📚 قصة واحدة مقروءة!
                    </p>
                </div>
            )}

        </section>
    );
}
