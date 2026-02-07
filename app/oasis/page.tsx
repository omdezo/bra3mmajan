"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Book, Heart, Sun, Moon } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const islamicContent = [
    {
        id: 1,
        title: "تحفيظ جزء عمّ",
        icon: Book,
        description: "احفظ القرآن الكريم بطريقة سهلة وممتعة",
        color: "from-green-500 to-green-700",
        bgColor: "bg-green-100"
    },
    {
        id: 2,
        title: "أدعية الطفل المسلم",
        icon: Heart,
        description: "تعلم الأدعية اليومية والمأثورة",
        color: "from-blue-500 to-blue-700",
        bgColor: "bg-blue-100"
    },
    {
        id: 3,
        title: "أذكار الصباح والمساء",
        icon: Sun,
        description: "احفظ أذكارك اليومية",
        color: "from-yellow-500 to-yellow-700",
        bgColor: "bg-yellow-100"
    },
    {
        id: 4,
        title: "آداب إسلامية",
        icon: Moon,
        description: "تعلم الآداب الإسلامية الجميلة",
        color: "from-purple-500 to-purple-700",
        bgColor: "bg-purple-100"
    }
];

export default function OasisPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-teal-900 via-emerald-800 to-green-700" dir="rtl">
            <Navbar />
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                        />
                    ))}
                </div>

                {/* Crescent Moon */}
                <motion.div
                    className="absolute top-10 left-10 md:left-20 w-24 h-24 md:w-32 md:h-32"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-yellow-300 rounded-full shadow-[0_0_40px_rgba(253,224,71,0.8)]" />
                        <div className="absolute top-1 right-3 w-[85%] h-[85%] bg-gradient-to-b from-teal-900 via-emerald-800 to-green-700 rounded-full" />
                    </div>
                </motion.div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <Link href="/#oasis" className="inline-flex items-center gap-2 text-green-300 font-bold mb-6 hover:gap-4 transition-all">
                        <span>→</span>
                        <span>العودة للرئيسية</span>
                    </Link>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <motion.div
                            className="relative w-64 h-64"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <Image
                                src="/assets/نور.png"
                                alt="نور"
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        <div className="flex-1 text-center md:text-right">
                            <motion.h1
                                className="text-5xl md:text-7xl font-black text-green-300 mb-4"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                🕌 واحة نور
                            </motion.h1>
                            <motion.p
                                className="text-2xl md:text-3xl text-green-200 font-bold mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                مع نُور - البُرعُمة المؤمنة
                            </motion.p>
                            <motion.p
                                className="text-lg md:text-xl text-green-100 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                المحتوى الديني والإسلامي بأسلوب محبب للأطفال!
                                <br />
                                <span className="text-green-300 font-bold">تعلم القيم الإسلامية مع نور! 🌙</span>
                            </motion.p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black text-center text-green-300 mb-12">اختر ما تريد تعلمه</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {islamicContent.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                className="relative group"
                            >
                                <div className={`${item.bgColor} rounded-3xl p-8 border-4 border-green-400 shadow-xl hover:shadow-2xl transition-all cursor-pointer`}>
                                    <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                                        <item.icon className="w-10 h-10 text-white" />
                                    </div>

                                    <h3 className="text-3xl font-black text-gray-800 mb-3">{item.title}</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">{item.description}</p>

                                    <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg active:scale-95">
                                        ابدأ التعلم
                                    </button>

                                    <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-sm border-2 border-yellow-600">
                                        قريباً
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Character Section */}
            <section className="py-16 px-4 bg-gradient-to-b from-green-900/50 to-teal-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring" }}
                        viewport={{ once: true }}
                        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border-4 border-green-400 shadow-2xl"
                    >
                        <h2 className="text-4xl font-black text-green-300 mb-6">عن نُور 🌙</h2>
                        <p className="text-xl text-green-100 leading-relaxed">
                            <strong>نور</strong> طفلة عُمانية ترتدي الحجاب بألوان زاهية، هادئة ومحبوبة، تعلّم الأطفال القيم الإسلامية بلطف ومحبة!
                        </p>
                    </motion.div>
                </div>
            </section>

        </main>
    );
}
