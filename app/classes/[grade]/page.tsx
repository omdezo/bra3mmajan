"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";
import { useState, useEffect, use } from "react";

interface ApiClass {
  _id: string;
  title: string;
  subject: string;
  grade: number;
  teacher: string;
  teamsLink: string;
  description?: string;
  day?: string;
  time?: string;
  icon: string;
  color: string;
  isActive: boolean;
}

const GRADE_CONFIG: Record<number, {
  label: string; emoji: string; character: string;
  gradient: string; bg: string; bgPage: string; border: string;
  iconBg: string; badge: string; textColor: string; lightGrad: string;
}> = {
  1: {
    label: 'الصف الأول', emoji: '1️⃣', character: '🧒',
    gradient: 'from-blue-500 to-blue-700', bg: 'bg-blue-50', bgPage: 'from-blue-100 via-blue-50 to-indigo-100',
    border: 'border-blue-300', iconBg: 'from-blue-400 to-blue-600',
    badge: 'bg-blue-100 text-blue-700', textColor: 'text-blue-700', lightGrad: 'from-blue-200 to-blue-300',
  },
  2: {
    label: 'الصف الثاني', emoji: '2️⃣', character: '👦',
    gradient: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50', bgPage: 'from-emerald-100 via-green-50 to-teal-100',
    border: 'border-emerald-300', iconBg: 'from-emerald-400 to-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700', textColor: 'text-emerald-700', lightGrad: 'from-emerald-200 to-emerald-300',
  },
  3: {
    label: 'الصف الثالث', emoji: '3️⃣', character: '👧',
    gradient: 'from-purple-500 to-purple-700', bg: 'bg-purple-50', bgPage: 'from-purple-100 via-purple-50 to-indigo-100',
    border: 'border-purple-300', iconBg: 'from-purple-400 to-purple-600',
    badge: 'bg-purple-100 text-purple-700', textColor: 'text-purple-700', lightGrad: 'from-purple-200 to-purple-300',
  },
  4: {
    label: 'الصف الرابع', emoji: '4️⃣', character: '🧑',
    gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', bgPage: 'from-amber-100 via-orange-50 to-yellow-100',
    border: 'border-amber-300', iconBg: 'from-amber-400 to-orange-500',
    badge: 'bg-amber-100 text-amber-700', textColor: 'text-amber-700', lightGrad: 'from-amber-200 to-amber-300',
  },
};

export default function GradePage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade: gradeStr } = use(params);
  const grade = Number(gradeStr);
  const config = GRADE_CONFIG[grade];

  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/classes?grade=${grade}&limit=50`)
      .then(r => r.json())
      .then(d => { if (d.success) setClasses(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [grade]);

  if (!config) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-cyan-100 via-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
        <Navbar />
        <div className="text-center">
          <div className="text-6xl mb-4">🤷</div>
          <h1 className="text-2xl font-bold text-gray-700 mb-4">الصف غير موجود</h1>
          <Link href="/classes" className="text-blue-600 font-bold underline">العودة لقائمة الصفوف</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-gradient-to-b ${config.bgPage}`} dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="relative py-16 md:py-20 px-4 overflow-hidden">
        {/* Floating dots */}
        <div className="absolute inset-0 opacity-15">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 bg-gradient-to-br ${config.gradient} rounded-full`}
              style={{ top: `${(i * 43 + 17) % 100}%`, left: `${(i * 37 + 23) % 100}%` }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
              transition={{ duration: (i % 3) + 2, repeat: Infinity }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/classes" className={`inline-flex items-center gap-2 ${config.textColor} font-bold mb-8 hover:gap-4 transition-all`}>
            <span>→</span><span>العودة لقائمة الصفوف</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Grade Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className={`w-40 h-40 md:w-52 md:h-52 bg-gradient-to-br ${config.gradient} rounded-[2rem] flex items-center justify-center shadow-2xl`}>
                <span className="text-7xl md:text-8xl">{config.character}</span>
              </div>
              <motion.div
                className={`absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg`}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-2xl">{config.emoji}</span>
              </motion.div>
            </motion.div>

            {/* Text */}
            <div className="flex-1 text-center md:text-right">
              <motion.h1
                className={`text-5xl md:text-7xl font-black ${config.textColor} mb-4`}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {config.label}
              </motion.h1>
              <motion.p
                className="text-2xl md:text-3xl text-gray-600 font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                الحصص الافتراضية عبر Microsoft Teams
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 justify-center md:justify-end"
              >
                <span className={`text-sm font-bold px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white shadow`}>
                  {loading ? '...' : `${classes.length} ${classes.length === 1 ? 'حصة' : 'حصص'} متاحة`}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Classes */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin`} style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }} />
            </div>
          ) : classes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {classes.map((cls, i) => (
                <motion.div
                  key={cls._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group"
                >
                  <div className={`${config.bg} rounded-2xl overflow-hidden border-2 ${config.border} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                    {/* Top color bar */}
                    <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />

                    <div className="p-5">
                      {/* Icon + Subject */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${config.iconBg} rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg`}>
                          <span className="text-2xl">{cls.icon}</span>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${config.badge}`}>
                          {cls.subject}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-black text-gray-800 mb-3 leading-snug">{cls.title}</h3>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-base">👤</span>
                          <span className="font-bold">{cls.teacher}</span>
                        </div>
                        {cls.day && cls.time && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="text-base">📅</span>
                            <span>{cls.day} — {cls.time}</span>
                          </div>
                        )}
                        {cls.description && (
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{cls.description}</p>
                        )}
                      </div>

                      {/* Join Button */}
                      <a
                        href={cls.teamsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full text-center px-4 py-3 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95`}
                      >
                        انضم للحصة عبر Teams 🎥
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${config.bg} rounded-3xl p-12 border-2 border-dashed ${config.border} text-center max-w-lg mx-auto`}
            >
              <span className="text-6xl mb-4 block">📭</span>
              <h3 className={`text-2xl font-black ${config.textColor} mb-2`}>لا توجد حصص حالياً</h3>
              <p className="text-gray-500 font-medium">سيتم إضافة الحصص قريباً</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* How to Join */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`bg-gradient-to-br ${config.gradient} text-white p-8 md:p-10 rounded-3xl border-4 ${config.border} shadow-2xl`}
          >
            <h3 className="text-2xl md:text-3xl font-black text-center mb-6">📱 كيف تنضم للحصة؟</h3>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 text-right mb-4">
              <ol className="space-y-2.5 text-base font-bold">
                <li>1️⃣ اختر الحصة التي تريد الانضمام إليها</li>
                <li>2️⃣ اضغط على زر &quot;انضم للحصة عبر Teams&quot;</li>
                <li>3️⃣ سيتم فتح Microsoft Teams تلقائياً</li>
                <li>4️⃣ ابدأ التعلم والتفاعل مع معلمك! 🎓</li>
              </ol>
            </div>
            <p className="text-center font-bold">💡 تأكد من تحميل تطبيق Microsoft Teams على جهازك</p>
          </motion.div>
        </div>
      </section>

      {/* Visitor Counter */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <VisitorCounter pageName="classes" />
        </div>
      </section>
    </main>
  );
}
