"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Target, Users, BookCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const challengeTypes = [
    {
        id: 1,
        title: "كويز المعلومات العامة",
        icon: BookCheck,
        description: "اختبر معلوماتك في مختلف المجالات",
        color: "from-blue-500 to-blue-700",
        bgColor: "bg-blue-100"
    },
    {
        id: 2,
        title: "تحديات أسبوعية",
        icon: Target,
        description: "تحديات جديدة كل أسبوع",
        color: "from-orange-500 to-orange-700",
        bgColor: "bg-orange-100"
    },
    {
        id: 3,
        title: "مسابقات بين الأصدقاء",
        icon: Users,
        description: "تحدى أصدقاءك وأثبت تفوقك",
        color: "from-purple-500 to-purple-700",
        bgColor: "bg-purple-100"
    },
    {
        id: 4,
        title: "أختبر نفسك",
        icon: Trophy,
        description: "اختبر معلوماتك ومهاراتك",
        color: "from-green-500 to-green-700",
        bgColor: "bg-green-100"
    }
];

export default function ChallengesPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100" dir="rtl">
            <Navbar />
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => {
                        const top = (i * 41 + 19) % 100;
                        const left = (i * 33 + 27) % 100;
                        const duration = (i % 5) + 5;
                        return (
                            <motion.div
                                key={i}
                                className="absolute w-16 h-16 md:w-24 md:h-24 text-4xl md:text-5xl opacity-20"
                                style={{ top: `${top}%`, left: `${left}%` }}
                                animate={{ y: [0, -50, 0], rotate: [0, 360, 0] }}
                                transition={{ duration: duration, repeat: Infinity }}
                            >
                                🏆
                            </motion.div>
                        );
                    })}
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <Link href="/#challenges" className="inline-flex items-center gap-2 text-sky-700 font-bold mb-6 hover:gap-4 transition-all">
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
                                src="/assets/سيف.png"
                                alt="سيف"
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        <div className="flex-1 text-center md:text-right">
                            <motion.h1
                                className="text-5xl md:text-7xl font-black text-sky-700 mb-4"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                🏆 ساحة التحدي
                            </motion.h1>
                            <motion.p
                                className="text-2xl md:text-3xl text-sky-600 font-bold mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                مع سَيف - الصقر الذكي
                            </motion.p>
                            <motion.p
                                className="text-lg md:text-xl text-gray-700 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                مسابقات وتحديات ذهنية وأسئلة تفاعلية!
                                <br />
                                <span className="text-sky-700 font-bold">تحدى نفسك وأصدقاءك مع سيف! 🦅</span>
                            </motion.p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Challenges Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black text-center text-sky-700 mb-12">اختر التحدي</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {challengeTypes.map((challenge, index) => (
                            <motion.div
                                key={challenge.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, rotate: -2 }}
                                className="relative group"
                            >
                                <div className={`${challenge.bgColor} rounded-3xl p-8 border-4 border-sky-500 shadow-xl hover:shadow-2xl transition-all cursor-pointer`}>
                                    <div className={`w-20 h-20 bg-gradient-to-br ${challenge.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                                        <challenge.icon className="w-10 h-10 text-white" />
                                    </div>

                                    <h3 className="text-3xl font-black text-gray-800 mb-3">{challenge.title}</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">{challenge.description}</p>

                                    <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-full font-bold hover:from-sky-600 hover:to-sky-700 transition-all shadow-lg active:scale-95">
                                        ابدأ التحدي
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
            <section className="py-16 px-4 bg-gradient-to-b from-sky-100 to-sky-50">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring" }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-8 md:p-12 border-4 border-sky-500 shadow-2xl"
                    >
                        <h2 className="text-4xl font-black text-sky-700 mb-6">عن سَيف 🦅</h2>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            <strong>سيف</strong> صقر عُماني أصيل، سريع البديهة وحاد الذكاء، يحب التنافس الشريف ويكافئ المتفوقين. استعد للتحديات معه!
                        </p>
                    </motion.div>
                </div>
            </section>

        </main>
    );
}
