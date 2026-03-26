"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Video, Calendar, Users } from "lucide-react";
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
  day?: string;
  time?: string;
  icon: string;
  color: string;
  isActive: boolean;
}

const GRADE_CONFIG: Record<number, { label: string; color: string; gradient: string; bg: string; border: string; iconBg: string; badge: string }> = {
  1: { label: 'الصف الأول', color: 'text-blue-700', gradient: 'from-blue-500 to-blue-700', bg: 'bg-blue-50', border: 'border-blue-300', iconBg: 'from-blue-400 to-blue-600', badge: 'bg-blue-100 text-blue-700' },
  2: { label: 'الصف الثاني', color: 'text-emerald-700', gradient: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300', iconBg: 'from-emerald-400 to-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  3: { label: 'الصف الثالث', color: 'text-purple-700', gradient: 'from-purple-500 to-purple-700', bg: 'bg-purple-50', border: 'border-purple-300', iconBg: 'from-purple-400 to-purple-600', badge: 'bg-purple-100 text-purple-700' },
  4: { label: 'الصف الرابع', color: 'text-amber-700', gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-300', iconBg: 'from-amber-400 to-orange-500', badge: 'bg-amber-100 text-amber-700' },
};

const GRADE_EMOJIS: Record<number, string> = { 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣' };

export default function ClassesPage() {
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/classes?limit=100')
      .then(r => r.json())
      .then(d => { if (d.success) setClasses(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group classes by grade
  const gradeGroups: Record<number, ApiClass[]> = { 1: [], 2: [], 3: [], 4: [] };
  classes.forEach(c => {
    if (gradeGroups[c.grade]) gradeGroups[c.grade].push(c);
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-100 via-blue-50 to-indigo-100" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              style={{ top: `${(i * 43 + 17) % 100}%`, left: `${(i * 37 + 23) % 100}%` }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: (i % 3) + 2, repeat: Infinity }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6 hover:gap-4 transition-all">
            <span>→</span><span>العودة للرئيسية</span>
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

      {/* Digital Curriculum */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-1 shadow-[0_20px_60px_rgba(5,150,105,0.4)]"
          >
            <div className="absolute inset-0 opacity-20">
              <motion.div
                className="absolute inset-0"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)' }}
                animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2.3rem] p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  className="relative"
                  animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white transform rotate-6">
                      <span className="text-6xl md:text-7xl -rotate-6">📚</span>
                    </div>
                    <motion.span className="absolute -top-4 -right-4 text-4xl" animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }}>✨</motion.span>
                    <motion.span className="absolute -bottom-4 -left-4 text-4xl" animate={{ rotate: -360, scale: [1, 1.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>🌟</motion.span>
                  </div>
                </motion.div>
                <div className="flex-1 text-center md:text-right">
                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                    <div className="inline-block bg-gradient-to-r from-emerald-600 to-teal-700 text-emerald-50 px-6 py-2 rounded-full text-sm md:text-base font-black mb-4 shadow-lg">🇴🇲 مبادرة وطنية 🇴🇲</div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
                      <span className="bg-gradient-to-r from-emerald-700 to-teal-700 text-transparent bg-clip-text">رقمنة المناهج العمانية</span>
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-bold leading-relaxed mb-8">
                      نحول التعليم التقليدي إلى تجربة رقمية تفاعلية حديثة
                      <br />
                      <span className="text-emerald-700">مواكبة رؤية عُمان ٢٠٤٠ في التعليم الرقمي 🚀</span>
                    </p>
                    <div className="flex justify-center md:justify-end">
                      <a href="https://ict.moe.gov.om/" target="_blank" rel="noopener noreferrer"
                        className="inline-block bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 py-4 rounded-2xl font-black text-lg md:text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-4 border-white">
                        📖 المناهج الرقمية الصفوف ١-٤
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="absolute top-4 left-4 text-2xl opacity-30">🎓</div>
              <div className="absolute bottom-4 right-4 text-2xl opacity-30">📱</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grade Sections */}
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
            <div className="space-y-12">
              {([1, 2, 3, 4] as const).map((grade, gi) => {
                const config = GRADE_CONFIG[grade];
                const gradeClasses = gradeGroups[grade];

                return (
                  <motion.div
                    key={grade}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: gi * 0.1 }}
                  >
                    {/* Grade Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${config.iconBg} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <span className="text-2xl">{GRADE_EMOJIS[grade]}</span>
                      </div>
                      <div>
                        <h3 className={`text-3xl font-black ${config.color}`}>{config.label}</h3>
                        <p className="text-sm text-gray-500 font-bold">
                          {gradeClasses.length > 0
                            ? `${gradeClasses.length} ${gradeClasses.length === 1 ? 'حصة' : 'حصص'}`
                            : 'لا توجد حصص حالياً'}
                        </p>
                      </div>
                      <div className={`flex-1 h-px bg-gradient-to-l ${config.gradient} opacity-20`} />
                    </div>

                    {/* Classes Grid */}
                    {gradeClasses.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gradeClasses.map((cls, ci) => (
                          <motion.div
                            key={cls._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: ci * 0.05 }}
                            className="group"
                          >
                            <div className={`${config.bg} rounded-2xl p-5 border-2 ${config.border} shadow-md hover:shadow-xl transition-all hover:-translate-y-1`}>
                              {/* Top: Icon + Subject Badge */}
                              <div className="flex items-center justify-between mb-3">
                                <div className={`w-12 h-12 bg-gradient-to-br ${config.iconBg} rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow`}>
                                  <span className="text-2xl">{cls.icon}</span>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${config.badge}`}>
                                  {cls.subject}
                                </span>
                              </div>

                              {/* Title */}
                              <h4 className="text-lg font-black text-gray-800 mb-2 leading-snug">{cls.title}</h4>

                              {/* Info */}
                              <div className="space-y-1 mb-3">
                                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                  <span>👤</span>
                                  <span className="font-medium">{cls.teacher}</span>
                                </p>
                                {cls.day && cls.time && (
                                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                    <span>📅</span>
                                    <span>{cls.day} — {cls.time}</span>
                                  </p>
                                )}
                                {cls.description && (
                                  <p className="text-sm text-gray-500 line-clamp-2">{cls.description}</p>
                                )}
                              </div>

                              {/* Join Button */}
                              <a
                                href={cls.teamsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full text-center px-4 py-2.5 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95`}
                              >
                                انضم للحصة عبر Teams 🎥
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className={`${config.bg} rounded-2xl p-8 border-2 border-dashed ${config.border} text-center`}>
                        <span className="text-4xl mb-2 block">📭</span>
                        <p className={`text-lg font-bold ${config.color} opacity-60`}>لا توجد حصص لهذا الصف حالياً</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center text-blue-700 mb-12">مميزات التعلم الافتراضي</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Video, label: 'حصص مباشرة', desc: 'تفاعل مباشر مع المعلم والطلاب', colors: 'from-blue-400 to-blue-600' },
              { icon: Calendar, label: 'جدول منظم', desc: 'حصص مجدولة وفق أوقات محددة', colors: 'from-cyan-400 to-cyan-600' },
              { icon: Users, label: 'تعلم تعاوني', desc: 'تواصل وتعاون مع زملائك', colors: 'from-purple-400 to-purple-600' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${f.colors} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <f.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2">{f.label}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join */}
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
                <li>1️⃣ اختر صفك الدراسي من الأقسام أعلاه</li>
                <li>2️⃣ اضغط على زر &quot;انضم للحصة عبر Teams&quot;</li>
                <li>3️⃣ سيتم فتح Microsoft Teams تلقائياً</li>
                <li>4️⃣ ابدأ التعلم والتفاعل مع معلمك! 🎓</li>
              </ol>
            </div>
            <p className="text-xl font-bold">💡 تأكد من تحميل تطبيق Microsoft Teams على جهازك</p>
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
