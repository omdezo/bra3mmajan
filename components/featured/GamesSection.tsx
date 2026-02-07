"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const worlds = [
    {
        id: 1,
        name: "وادي الأرقام",
        color: "from-blue-400 to-blue-600",
        ground: "bg-amber-100",
        elements: ["🌵", "🪨", "🔢"],
        description: "انطلق في مغامرة الحساب!",
        link: "/games/math"
    },
    {
        id: 2,
        name: "قلعة الحروف",
        color: "from-purple-400 to-purple-600",
        ground: "bg-stone-200",
        elements: ["🏰", "📜", "🅰️"],
        description: "اكتشف جمال اللغة العربية",
        link: "/games/language"
    },
    {
        id: 3,
        name: "واحة الألغاز",
        color: "from-green-400 to-green-600",
        ground: "bg-emerald-100",
        elements: ["🌴", "🧩", "💡"],
        description: "شغل عقلك وحل الألغاز",
        link: "/games/puzzle"
    }
];

export function GamesSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Horizontal scroll simulation: Map vertical scroll to horizontal movement
    // 0 -> 1 moves the container from 0% to -200% (showing 3 screens width)
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]);
    const smoothX = useSpring(x, { stiffness: 100, damping: 30 });

    // Parallax layers
    const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
    const fgX = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

    // Fahad's animation - Running/Bobbing
    // Since we are using a static image, we'll add a bounce effect to simulate running
    const fahadY = useTransform(scrollYProgress,
        [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        [0, -15, 0, -15, 0, -15, 0, -15, 0, -15, 0]
    );

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-sky-300">

            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">

                {/* Sky & Clouds (Fixed/Parallax) */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200 z-0">
                    <motion.div style={{ x: bgX }} className="absolute inset-0 opacity-50">
                        {/* Decorative Clouds */}
                        <div className="absolute top-20 left-20 w-32 h-12 bg-white rounded-full blur-xl" />
                        <div className="absolute top-40 left-1/2 w-48 h-12 bg-white rounded-full blur-2xl" />
                        <div className="absolute top-10 right-20 w-40 h-16 bg-white rounded-full blur-xl" />
                    </motion.div>
                </div>

                {/* Game Title HUD */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-center w-full px-4 pointer-events-none">
                    <div className="inline-block bg-white/90 backdrop-blur px-8 py-3 rounded-full border-4 border-yellow-400 shadow-xl pointer-events-auto">
                        <h2 className="text-2xl md:text-3xl font-black text-amber-600">سباق المعرفة</h2>
                        <p className="text-xs md:text-sm font-bold text-gray-600">ساعد فهد في الوصول إلى العوالم!</p>
                    </div>
                </div>

                {/* Moving Worlds Container */}
                <motion.div
                    style={{ x: smoothX }}
                    className="flex h-full w-[300%] relative z-10"
                >
                    {/* START LINE Decoration */}
                    <div className="absolute left-[5%] bottom-[20vh] z-20 flex flex-col items-center">
                        <div className="w-4 h-[60vh] bg-gradient-to-b from-black/80 to-transparent border-x-4 border-dotted border-white" />
                        <div className="bg-black text-yellow-400 font-black px-4 py-1 -mt-[60vh] border-4 border-white rotate-[-5deg]">البداية</div>
                    </div>

                    {worlds.map((world, index) => (
                        <div key={world.id} className="w-full h-full relative flex items-center justify-center border-r-4 border-white/20">
                            {/* World Background Elements (Mountains/Forts) */}
                            <div className={`absolute bottom-0 w-full h-[80%] bg-gradient-to-t ${world.color} opacity-40 transform skew-y-3 origin-bottom-left`} />

                            {/* Extra Scenery - Palms/Rocks */}
                            <div className="absolute bottom-[20vh] left-[10%] opacity-80 z-10">
                                <span className="text-[8rem]">🌴</span>
                            </div>
                            <div className="absolute bottom-[22vh] right-[15%] opacity-70 z-10">
                                <span className="text-[6rem]">🪨</span>
                            </div>

                            {/* Decorative Elements - Larger and more visible */}
                            <div className="absolute bottom-[25%] w-full flex justify-around opacity-80 pointer-events-none">
                                {world.elements.map((el, i) => (
                                    <span key={i} className="text-[10rem] md:text-[18rem] transform translate-y-20 filter drop-shadow-2xl">{el}</span>
                                ))}
                            </div>

                            {/* Game Portal/Card - Larger */}
                            <Link href={world.link} className="relative z-30 group mt-20">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-[22rem] h-[30rem] md:w-[28rem] md:h-[36rem] bg-white rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden relative cursor-pointer transform transition-transform"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${world.color} opacity-20`} />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl md:text-[10rem]">
                                        {world.elements[2]}
                                    </div>
                                    <div className="absolute top-6 right-6 text-5xl animate-bounce">⭐</div>

                                    <div className="absolute bottom-0 w-full p-8 bg-white/90 backdrop-blur text-center">
                                        <h3 className="text-3xl font-black mb-2 text-gray-800">{world.name}</h3>
                                        <p className="text-base font-bold text-gray-500">{world.description}</p>
                                        <div className="mt-4 bg-black/10 text-black/60 rounded-full py-2 text-sm font-bold">اضغط للعب</div>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    ))}
                </motion.div>

                {/* Ground */}
                <div className="absolute bottom-0 w-full h-[20vh] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 z-20 border-t-8 border-amber-300 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
                    {/* Running Track Markings (Foreground Parallax) */}
                    <motion.div
                        style={{ x: fgX }}
                        className="absolute top-4 w-[400%] h-full flex items-start pl-10"
                    >
                        <div className="flex gap-40 w-full">
                            {/* Track Lines and details */}
                            {[...Array(30)].map((_, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="w-20 h-4 bg-white/40 skew-x-12 rounded-full" />
                                    {i % 3 === 0 && <span className="text-4xl opacity-50 -mt-10 ml-10">🌿</span>}
                                    {i % 4 === 0 && <span className="text-3xl opacity-40 -mt-8 -ml-5">🍄</span>}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Fahad Character - Larger and Centered */}
                <motion.div
                    className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 md:-translate-x-1/3 z-40 w-48 h-48 md:w-80 md:h-80 box-content"
                    style={{ y: fahadY }}
                >
                    <Image
                        src="/assets/فهد.png"
                        alt="Fahad"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                    />

                    {/* Speed Lines Effect - Visualizing speed */}
                    <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-80 scale-150">
                        <motion.div
                            className="w-32 h-3 bg-white rounded-full opacity-60"
                            animate={{ x: [0, 60, 0], opacity: [0, 0.8, 0] }}
                            transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                        />
                        <motion.div
                            className="w-20 h-3 bg-white rounded-full opacity-60"
                            animate={{ x: [0, 60, 0], opacity: [0, 0.8, 0] }}
                            transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
                        />
                    </div>
                </motion.div>

                {/* Instructions Hint */}
                <div className="absolute bottom-4 right-4 z-50 bg-black/20 backdrop-blur text-white px-4 py-2 rounded-full font-bold animate-pulse text-sm md:text-base">
                    <span>مرر للركض 🏃‍♂️</span>
                </div>

            </div>
        </section>
    );
}
