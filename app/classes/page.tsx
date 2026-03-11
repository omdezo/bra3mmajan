"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Video, Calendar, Users, MonitorPlay } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";
import { useState, useEffect } from "react";

interface ApiClass {
    _id: string;
    title: string;
    subject: string;
    grade: number;
    teacher: string;
    teamsLink: string;
    description?: string;
    schedule?: string;
    day?: string;
    time?: string;
    icon: string;
    color: string;
    isActive: boolean;
}

const BG_COLORS = ["bg-blue-100", "bg-green-100", "bg-purple-100", "bg-orange-100", "bg-pink-100", "bg-cyan-100"];
const GRADIENT_COLORS = ["from-blue-500 to-blue-700", "from-green-500 to-green-700", "from-purple-500 to-purple-700", "from-orange-500 to-orange-700", "from-pink-500 to-pink-700", "from-cyan-500 to-cyan-700"];

const STATIC_CLASSES: ApiClass[] = [
    { _id: '1', title: "الصف الأول الأساسي", subject: "عام", grade: 1, teacher: "المعلم", icon: "💻", color: "#3B82F6", description: "حصص مباشرة وتفاعلية للصف الأول", teamsLink: "https://teams.microsoft.com", isActive: true },
    { _id: '2', title: "الصف الثاني الأساسي", subject: "عام", grade: 2, teacher: "المعلم", icon: "💻", color: "#10B981", description: "حصص مباشرة وتفاعلية للصف الثاني", teamsLink: "https://teams.microsoft.com", isActive: true },
    { _id: '3', title: "الصف الثالث الأساسي", subject: "عام", grade: 3, teacher: "المعلم", icon: "💻", color: "#8B5CF6", description: "حصص مباشرة وتفاعلية للصف الثالث", teamsLink: "https://teams.microsoft.com", isActive: true },
    { _id: '4', title: "الصف الرابع الأساسي", subject: "عام", grade: 4, teacher: "المعلم", icon: "💻", color: "#F59E0B", description: "حصص مباشرة وتفاعلية للصف الرابع", teamsLink: "https://teams.microsoft.com", isActive: true },
];

export default function ClassesPage() {
    const [classes, setClasses] = useState<ApiClass[]>(STATIC_CLASSES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/classes?limit=20')
            .then(r => r.json())
            .then(d => { if (d.success && d.data.length > 0) setClasses(d.data) })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-b from-cyan-100 via-blue-50 to-indigo-100" dir="rtl">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    {[...Array(15)].map((_, i) => {
                        const top = (i * 43 + 17) % 100;
                        const left = (i * 37 + 23) % 100;
                        const duration = (i % 3) + 2;
                        return (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-blue-500 rounded-full"
                                style={{ top: `${top}%`, left: `${left}%` }}
                                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                                transition={{ duration: duration, repeat: Infinity }}
                            />
                        );
                    })}
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6 hover:gap-4 transition-all">
                        <span>→</span>
                        <span>العودة للرئيسية</span>
                    </Link>

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <motion.div
                            className="relative w-48 h-48 md:w-64 md:h-64"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
                                <Video className="w-24 h-24 md:w-32 md:h-32 text-white" strokeWidth={2} />
                            </div>
                        </motion.div>

                        <div className="flex-1 text-center md:text-right">
                            <motion.h1
                                className="text-5xl md:text-7xl font-black text-blue-700 mb-4"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                💻 الحصص الافتراضية
                            </motion.h1>
                            <motion.p
                                className="text-2xl md:text-3xl text-cyan-700 font-bold mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                تعلم عن بُعد عبر Microsoft Teams
                            </motion.p>
                            <motion.p
                                className="text-lg md:text-xl text-gray-700 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                انضم إلى الحصص المباشرة وتفاعل مع معلميك وزملائك!
                                <br />
                                <span className="text-blue-700 font-bold">التعليم الحديث في متناول يدك! 🎓</span>
                            </motion.p>
                        </div>
                    </div>
                </div>
            </section>

            {/* رقمنة المناهج العمانية - Digital Curriculum Initiative */}
            <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-1 shadow-[0_20px_60px_rgba(5,150,105,0.4)]"
                    >
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)',
                                }}
                                animate={{
                                    backgroundPosition: ['0px 0px', '40px 40px'],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* Inner Content */}
                        <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2.3rem] p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center gap-8">

                                {/* Icon Section */}
                                <motion.div
                                    className="relative"
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 3, -3, 0],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <div className="relative">
                                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white transform rotate-6">
                                            <span className="text-6xl md:text-7xl -rotate-6">📚</span>
                                        </div>
                                        {/* Floating Stars */}
                                        <motion.span
                                            className="absolute -top-4 -right-4 text-4xl"
                                            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            ✨
                                        </motion.span>
                                        <motion.span
                                            className="absolute -bottom-4 -left-4 text-4xl"
                                            animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                                            transition={{ duration: 2.5, repeat: Infinity }}
                                        >
                                            🌟
                                        </motion.span>
                                    </div>
                                </motion.div>

                                {/* Text Content */}
                                <div className="flex-1 text-center md:text-right">
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="inline-block bg-gradient-to-r from-emerald-600 to-teal-700 text-emerald-50 px-6 py-2 rounded-full text-sm md:text-base font-black mb-4 shadow-lg">
                                            🇴🇲 مبادرة وطنية 🇴🇲
                                        </div>

                                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
                                            <span className="bg-gradient-to-r from-emerald-700 to-teal-700 text-transparent bg-clip-text">
                                                رقمنة المناهج العمانية
                                            </span>
                                        </h2>

                                        <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-bold leading-relaxed mb-8">
                                            نحول التعليم التقليدي إلى تجربة رقمية تفاعلية حديثة
                                            <br />
                                            <span className="text-emerald-700">مواكبة رؤية عُمان ٢٠٤٠ في التعليم الرقمي 🚀</span>
                                        </p>

                                        {/* Button */}
                                        <div className="flex justify-center md:justify-end">
                                            <a
                                                href="https://ict.moe.gov.om/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 py-4 rounded-2xl font-black text-lg md:text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-4 border-white"
                                            >
                                                📖 المناهج الرقمية الصفوف ١-٤
                                            </a>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Decorative Corner Elements */}
                            <div className="absolute top-4 left-4 text-2xl opacity-30">🎓</div>
                            <div className="absolute bottom-4 right-4 text-2xl opacity-30">📱</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Classes Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-black text-center text-blue-700 mb-4">اختر صفك الدراسي</h2>
                    <p className="text-xl text-center text-gray-600 font-bold mb-12">
                        انضم للحصة المباشرة عبر Microsoft Teams
                    </p>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {classes.map((classItem, index) => {
                            const bgColor = BG_COLORS[index % BG_COLORS.length];
                            const gradColor = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
                            return (
                            <motion.div
                                key={classItem._id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, rotate: -2 }}
                                className="relative group"
                            >
                                <div className={`${bgColor} rounded-3xl p-8 border-4 border-blue-400 shadow-xl hover:shadow-2xl transition-all`}>
                                    <div className={`w-20 h-20 bg-gradient-to-br ${gradColor} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                                        {classItem.icon ? (
                                            <span className="text-4xl">{classItem.icon}</span>
                                        ) : (
                                            <MonitorPlay className="w-10 h-10 text-white" />
                                        )}
                                    </div>

                                    <h3 className="text-3xl font-black text-gray-800 mb-1">{classItem.title}</h3>
                                    <p className="text-sm font-bold text-blue-600 mb-1">{classItem.subject} — الصف {classItem.grade}</p>
                                    <p className="text-sm text-gray-500 mb-2">👤 {classItem.teacher}</p>
                                    {classItem.day && classItem.time && (
                                        <p className="text-sm text-gray-500 mb-2">📅 {classItem.day} — {classItem.time}</p>
                                    )}
                                    {classItem.description && (
                                        <p className="text-lg text-gray-600 leading-relaxed mb-4">{classItem.description}</p>
                                    )}

                                    <a
                                        href={classItem.teamsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-block px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}
                                    >
                                        انضم للحصة عبر Teams 🎥
                                    </a>
                                </div>
                            </motion.div>
                            );
                        })}
                    </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-cyan-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-black text-center text-blue-700 mb-12">مميزات التعلم الافتراضي</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Video className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 mb-2">حصص مباشرة</h3>
                            <p className="text-gray-600">تفاعل مباشر مع المعلم والطلاب</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 mb-2">جدول منظم</h3>
                            <p className="text-gray-600">حصص مجدولة وفق أوقات محددة</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 mb-2">تعلم تعاوني</h3>
                            <p className="text-gray-600">تواصل وتعاون مع زملائك</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Microsoft Teams Info */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-blue-600 to-cyan-700 text-white p-8 md:p-12 rounded-3xl border-4 border-blue-300 shadow-2xl text-center"
                    >
                        <div className="text-6xl mb-6">📱</div>
                        <h2 className="text-3xl md:text-4xl font-black mb-4">كيف تنضم للحصة؟</h2>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-right mb-6">
                            <ol className="space-y-3 text-lg font-bold">
                                <li>1️⃣ اختر صفك الدراسي من القائمة أعلاه</li>
                                <li>2️⃣ اضغط على زر "انضم للحصة عبر Teams"</li>
                                <li>3️⃣ سيتم فتح Microsoft Teams تلقائياً</li>
                                <li>4️⃣ ابدأ التعلم والتفاعل مع معلمك! 🎓</li>
                            </ol>
                        </div>
                        <p className="text-xl font-bold">
                            💡 تأكد من تحميل تطبيق Microsoft Teams على جهازك
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Visitor Counter */}
            <section className="py-8 px-4 bg-gradient-to-b from-cyan-50 to-blue-100">
                <div className="max-w-6xl mx-auto flex justify-center">
                    <VisitorCounter pageName="classes" />
                </div>
            </section>
        </main>
    );
}
