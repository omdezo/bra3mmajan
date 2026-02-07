"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

// Treasure Data - ensuring we use available assets
const treasures = [
    { id: 1, name: "الخنجر العُماني", image: "/assets/omani_khanjar.png", position: { top: "20%", left: "20%" }, size: 100 },
    { id: 2, name: "الفخار التقليدي", image: "/assets/omani_pottery.png", position: { top: "15%", left: "50%" }, size: 90 },
    { id: 3, name: "القلاع والحصون", image: "/assets/omani_fort_model.png", position: { top: "25%", left: "80%" }, size: 120 },
    { id: 4, name: "السفن العُمانية", image: "/assets/omani_ship.png", position: { top: "40%", left: "30%" }, size: 110 },
    { id: 5, name: "الحلي والمجوهرات", image: "/assets/omani_jewelry.png", position: { top: "35%", left: "65%" }, size: 90 }, // Creating a visual variety
];

export function VarietySection() {
    const containerRef = useRef(null);
    const [isChestOpen, setIsChestOpen] = useState(false);
    const [clickedTreasures, setClickedTreasures] = useState<number[]>([]);

    // Hydration fix
    const [particles, setParticles] = useState<{ id: number; width: number; height: number; top: number; left: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        setParticles(Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            top: Math.random() * 100,
            left: Math.random() * 100,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5
        })));
    }, []);

    // Parallax background
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const yMaha = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

    const handleTreasureClick = (id: number) => {
        if (!clickedTreasures.includes(id)) {
            setClickedTreasures([...clickedTreasures, id]);
        }
    };

    return (
        <section ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-sky-300 via-amber-100 to-amber-200 overflow-hidden flex items-center justify-center p-4">

            {/* Parallax Background Layers */}
            <motion.div style={{ y: yBackground }} className="absolute inset-0 z-0">
                {/* Distant Dunes - Faded into sky */}
                <div
                    className="absolute bottom-0 w-full h-full bg-[url('/assets/omani_landscape.png')] bg-cover bg-bottom opacity-60 mix-blend-overlay"
                    style={{
                        maskImage: 'linear-gradient(to top, black 30%, transparent 80%)',
                        WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 80%)'
                    }}
                />

                {/* Color blending overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-200/50 via-transparent to-transparent" />
            </motion.div>

            {/* Maha (The Oryx) - Guide */}
            <motion.div
                className="absolute bottom-[5%] left-[5%] md:left-[10%] z-30 w-48 h-48 md:w-72 md:h-72 origin-bottom"
                style={{ y: yMaha }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            >
                <Image
                    src="/assets/مها.png"
                    alt="Maha الدليل"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                />
            </motion.div>

            {/* Floating Particles/Dust */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute bg-yellow-400 rounded-full opacity-60"
                        style={{
                            width: p.width,
                            height: p.height,
                            top: `${p.top}%`,
                            left: `${p.left}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: p.delay,
                        }}
                    />
                ))}
            </div>

            {/* The Main Stage */}
            <div className="relative z-20 w-full max-w-6xl flex flex-col items-center justify-center h-full gap-12 py-20">

                {/* Title Card */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="relative text-center z-40 bg-white/80 backdrop-blur-md px-10 py-6 rounded-full border-4 border-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.3)]"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-amber-800 drop-shadow-sm">
                        كنوز التراث العُماني
                    </h2>
                    <p className="text-lg text-amber-700 font-bold mt-2">
                        {isChestOpen ? "اجمع الكنوز المتناثرة!" : "اضغط على الصندوق لفتحه"}
                    </p>
                </motion.div>

                {/* The Magic Chest */}
                <motion.div
                    className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] cursor-pointer"
                    onClick={() => !isChestOpen && setIsChestOpen(true)}
                    whileHover={{ scale: isChestOpen ? 1 : 1.02 }}
                    animate={{
                        rotate: isChestOpen ? 0 : [0, -2, 2, -2, 2, 0]
                    }}
                    transition={{
                        rotate: { repeat: Infinity, repeatDelay: 3, duration: 0.5 }
                    }}
                >
                    <AnimatePresence mode="wait">
                        {!isChestOpen ? (
                            <motion.div
                                key="closed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src="/assets/mandoos_closed.png"
                                    alt="Omani Mandoos Chest Closed"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src="/assets/mandoos_open.png"
                                    alt="Omani Mandoos Chest Open"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                                {/* Glow effect slightly behind */}
                                <motion.div
                                    className="absolute inset-0 bg-yellow-400/30 blur-[80px] -z-10 rounded-full"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1.5 }}
                                    transition={{ duration: 0.8 }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Treasures flying out */}
                    {isChestOpen && treasures.map((treasure, index) => (
                        <motion.div
                            key={treasure.id}
                            className="absolute z-30"
                            style={{
                                width: treasure.size,
                                height: treasure.size,
                                left: "40%",
                                top: "30%", // Start roughly from chest opening
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={clickedTreasures.includes(treasure.id) ? {
                                x: 0,
                                y: 500, // Fly down (conceptually out of view or to collection)
                                scale: 0,
                                opacity: 0
                            } : {
                                x: (index - 2) * 80 + (Math.random() * 40 - 20), // Spread horizontally
                                y: -150 - (Math.random() * 50), // Fly up then float
                                scale: 1,
                                opacity: 1,
                            }}
                            transition={{
                                duration: clickedTreasures.includes(treasure.id) ? 0.5 : 0.8,
                                delay: clickedTreasures.includes(treasure.id) ? 0 : index * 0.1,
                                type: "spring"
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTreasureClick(treasure.id);
                            }}
                            whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                            <Image
                                src={treasure.image}
                                alt={treasure.name}
                                fill
                                className="object-contain drop-shadow-xl"
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Collection HUD */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex gap-4 items-center border-2 border-amber-200">
                    <span className="text-amber-800 font-bold">المجموعة:</span>
                    <div className="flex gap-2">
                        {treasures.map((t) => (
                            <div key={t.id} className={`w-10 h-10 relative rounded-full border-2 ${clickedTreasures.includes(t.id) ? 'border-amber-500 bg-amber-100' : 'border-gray-200 bg-gray-100 grayscale opacity-50'}`}>
                                <Image src={t.image} alt={t.name} fill className="object-contain p-1" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Win State Overlay */}
                <AnimatePresence>
                    {clickedTreasures.length === treasures.length && (
                        <motion.div
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white p-8 md:p-12 rounded-3xl text-center shadow-2xl border-4 border-amber-400 max-w-lg mx-4"
                                initial={{ scale: 0.5, y: 100 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ type: "spring" }}
                            >
                                <div className="text-6xl mb-4">👑</div>
                                <h3 className="text-3xl md:text-5xl font-black text-amber-600 mb-4">مذهل!</h3>
                                <p className="text-xl text-gray-700 font-bold mb-8">
                                    لقد جمعت كل كنوز عُمان التراثية!
                                </p>

                                <div className="flex flex-col md:flex-row justify-center gap-4">
                                    <Link
                                        href="/variety"
                                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                                    >
                                        دخول القسم
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsChestOpen(false);
                                            setClickedTreasures([]);
                                        }}
                                        className="px-8 py-3 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        لعب مرة أخرى
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
