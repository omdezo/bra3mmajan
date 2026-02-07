"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Heart, Lightbulb, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const storyCategories = [
    {
        id: 1,
        title: "حكايات عُمانية قديمة",
        icon: Globe,
        description: "قصص من التراث العُماني الأصيل",
        color: "from-amber-500 to-amber-700",
        bgColor: "bg-amber-100"
    },
    {
        id: 2,
        title: "قصص الأنبياء",
        icon: BookOpen,
        description: "تعلم من قصص الأنبياء عليهم السلام",
        color: "from-green-500 to-green-700",
        bgColor: "bg-green-100"
    },
    {
        id: 3,
        title: "قصص أخلاقية",
        icon: Heart,
        description: "قصص تعلمك القيم والأخلاق الحميدة",
        color: "from-pink-500 to-pink-700",
        bgColor: "bg-pink-100"
    },
    {
        id: 4,
        title: "مغامرات مصورة",
        icon: Lightbulb,
        description: "مغامرات شيقة ومثيرة",
        color: "from-purple-500 to-purple-700",
        bgColor: "bg-purple-100"
    }
];

export default function StoriesPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900" dir="rtl">
            <Navbar />
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                        />
                    ))}
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <Link href="/#stories" className="inline-flex items-center gap-2 text-yellow-300 font-bold mb-6 hover:gap-4 transition-all">
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
                                src="/assets/جدّي سالم.png"
                                alt="جدي سالم"
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        <div className="flex-1 text-center md:text-right">
                            <motion.h1
                                className="text-5xl md:text-7xl font-black text-yellow-300 mb-4"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                📚 مكتبة مجان
                            </motion.h1>
                            <motion.p
                                className="text-2xl md:text-3xl text-yellow-200 font-bold mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                مع جدّي سالم - راوي الحكايات
                            </motion.p>
                            <motion.p
                                className="text-lg md:text-xl text-yellow-100 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                قصص مصورة وحكايات تراثية وقصص أخلاقية!
                                <br />
                                <span className="text-yellow-300 font-bold">استمع لحكايات جدي سالم الشيقة! 📖</span>
                            </motion.p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stories Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black text-center text-yellow-300 mb-12">اختر قصتك المفضلة</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {storyCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                className="relative group"
                            >
                                <div className={`${category.bgColor} rounded-3xl p-8 border-4 border-yellow-400 shadow-xl hover:shadow-2xl transition-all cursor-pointer`}>
                                    <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                                        <category.icon className="w-10 h-10 text-white" />
                                    </div>

                                    <h3 className="text-3xl font-black text-gray-800 mb-3">{category.title}</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">{category.description}</p>

                                    <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-indigo-900 rounded-full font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg active:scale-95">
                                        اقرأ الآن
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
            <section className="py-16 px-4 bg-gradient-to-b from-yellow-900/30 to-indigo-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring" }}
                        viewport={{ once: true }}
                        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border-4 border-yellow-400 shadow-2xl"
                    >
                        <h2 className="text-4xl font-black text-yellow-300 mb-6">عن جدّي سالم 👴</h2>
                        <p className="text-xl text-yellow-100 leading-relaxed">
                            <strong>جدي سالم</strong> رجل حكيم يرتدي الدشداشة والمصر، يجلس تحت شجرة السدر ويروي القصص بصوته الدافئ. معه ستتعلم الحكمة والقيم من خلال القصص الشيقة!
                        </p>
                    </motion.div>
                </div>
            </section>

        </main>
    );
}
