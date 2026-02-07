"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Palette, Castle, Music, GraduationCap } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const varietyContent = [
    {
        id: 1,
        title: "ركن الإبداع",
        icon: Palette,
        description: "تلوين، رسم، أشغال يدوية، فنون عُمانية تقليدية",
        color: "from-pink-500 to-pink-700",
        bgColor: "bg-pink-100"
    },
    {
        id: 2,
        title: "كنوز عُمان",
        icon: Castle,
        description: "القلاع والحصون، الولايات، الأزياء التقليدية، الحرف اليدوية",
        color: "from-amber-500 to-amber-700",
        bgColor: "bg-amber-100"
    },
    {
        id: 3,
        title: "ركن الأناشيد",
        icon: Music,
        description: "أناشيد وطنية، تعليمية، إسلامية للأطفال",
        color: "from-purple-500 to-purple-700",
        bgColor: "bg-purple-100"
    },
    {
        id: 4,
        title: "ركن المدرسة",
        icon: GraduationCap,
        description: "شروحات للمنهج العُماني، تمارين تفاعلية، مراجعات",
        color: "from-blue-500 to-blue-700",
        bgColor: "bg-blue-100"
    }
];

export default function VarietyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-yellow-50" dir="rtl">
            <Navbar />
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(180,83,9,0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }} />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <Link href="/#variety" className="inline-flex items-center gap-2 text-amber-700 font-bold mb-6 hover:gap-4 transition-all">
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
                                src="/assets/مها.png"
                                alt="مها"
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        <div className="flex-1 text-center md:text-right">
                            <motion.h1
                                className="text-5xl md:text-7xl font-black text-amber-700 mb-4"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                🦌 قسم المنوعات
                            </motion.h1>
                            <motion.p
                                className="text-2xl md:text-3xl text-amber-600 font-bold mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                مع مَها - المهاة الرشيقة
                            </motion.p>
                            <motion.p
                                className="text-lg md:text-xl text-gray-700 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                أنشطة إضافية ومحتوى ثري يكمل تجربة التعلم!
                                <br />
                                <span className="text-amber-700 font-bold">اكتشف كنوز عُمان مع مها! 🎨</span>
                            </motion.p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black text-center text-amber-700 mb-12">اختر نشاطك المفضل</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {varietyContent.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, rotate: -2 }}
                                className="relative group"
                            >
                                <div className={`${item.bgColor} rounded-3xl p-8 border-4 border-amber-400 shadow-xl hover:shadow-2xl transition-all cursor-pointer`}>
                                    <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                                        <item.icon className="w-10 h-10 text-white" />
                                    </div>

                                    <h3 className="text-3xl font-black text-gray-800 mb-3">{item.title}</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">{item.description}</p>

                                    <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg active:scale-95">
                                        استكشف الآن
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
            <section className="py-16 px-4 bg-gradient-to-b from-amber-200 to-amber-100">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring" }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-8 md:p-12 border-4 border-amber-400 shadow-2xl"
                    >
                        <h2 className="text-4xl font-black text-amber-700 mb-6">عن مَها 🦌</h2>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            <strong>مها</strong> - المهاة العُمانية، رشيقة ولطيفة، ترمز للجمال العُماني الأصيل، ترشد الأطفال في قسم المنوعات وتقدم لهم الأنشطة المتنوعة بأسلوب محبب!
                        </p>
                    </motion.div>
                </div>
            </section>

        </main>
    );
}
