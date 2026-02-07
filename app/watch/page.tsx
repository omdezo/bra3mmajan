"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Tv, Music, BookOpen, Clapperboard } from "lucide-react";

const content = [
    {
        id: 1,
        title: "كرتون مغامرات براعم مجان",
        icon: Clapperboard,
        description: "شاهد أجمل المغامرات مع أبطال براعم مجان",
        color: "from-purple-500 to-purple-700",
        bgColor: "bg-purple-100"
    },
    {
        id: 2,
        title: "أناشيد عُمانية",
        icon: Music,
        description: "استمع لأجمل الأناشيد الوطنية والتعليمية",
        color: "from-pink-500 to-pink-700",
        bgColor: "bg-pink-100"
    },
    {
        id: 3,
        title: "فيديوهات تعليمية",
        icon: BookOpen,
        description: "تعلم مع الفيديوهات التعليمية الشيقة",
        color: "from-blue-500 to-blue-700",
        bgColor: "bg-blue-100"
    },
    {
        id: 4,
        title: "برامج أطفال",
        icon: Tv,
        description: "برامج ممتعة ومفيدة للأطفال",
        color: "from-green-500 to-green-700",
        bgColor: "bg-green-100"
    }
];

export default function WatchPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-pink-900" dir="rtl">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                        />
                    ))}
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <Link href="/#watch" className="inline-flex items-center gap-2 text-pink-300 font-bold mb-6 hover:gap-4 transition-all">
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
                                src="/assets/فرح.png"
                                alt="فرح"
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        <div className="flex-1 text-center md:text-right">
                            <motion.h1
                                className="text-5xl md:text-7xl font-black text-pink-300 mb-4"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                📺 شاشة البراعم
                            </motion.h1>
                            <motion.p
                                className="text-2xl md:text-3xl text-purple-200 font-bold mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                مع فرح - الفراشة المبدعة
                            </motion.p>
                            <motion.p
                                className="text-lg md:text-xl text-purple-100 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                محتوى مرئي متنوع من الكرتون والأناشيد والدروس المصورة!
                                <br />
                                <span className="text-pink-300 font-bold">استمتع بالمشاهدة مع فرح! 🦋</span>
                            </motion.p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black text-center text-pink-300 mb-12">اختر ما تحب مشاهدته</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {content.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, rotate: -2 }}
                                className="relative group"
                            >
                                <div className={`${item.bgColor} rounded-3xl p-8 border-4 border-purple-400 shadow-xl hover:shadow-2xl transition-all cursor-pointer`}>
                                    <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                                        <item.icon className="w-10 h-10 text-white" />
                                    </div>

                                    <h3 className="text-3xl font-black text-gray-800 mb-3">{item.title}</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">{item.description}</p>

                                    <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg active:scale-95">
                                        شاهد الآن
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
            <section className="py-16 px-4 bg-gradient-to-b from-pink-900/50 to-purple-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring" }}
                        viewport={{ once: true }}
                        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border-4 border-pink-400 shadow-2xl"
                    >
                        <h2 className="text-4xl font-black text-pink-300 mb-6">عن فرح 🦋</h2>
                        <p className="text-xl text-purple-100 leading-relaxed">
                            <strong>فرح</strong> فراشة جميلة ترتدي ثوباً عُمانياً ملوناً، تحب الفن والإبداع وتقدم المحتوى بأسلوب شيّق ومميز!
                        </p>
                    </motion.div>
                </div>
            </section>

        </main>
    );
}
