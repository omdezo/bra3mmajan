"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Video, Calendar, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";
import { useState, useEffect } from "react";

const GRADES = [
  {
    grade: 1,
    label: 'الصف الأول',
    emoji: '1️⃣',
    gradient: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    hoverBorder: 'hover:border-blue-400',
    shadow: 'hover:shadow-blue-200/60',
    textColor: 'text-blue-700',
    character: '🧒',
    desc: 'حصص تفاعلية للصف الأول الأساسي',
  },
  {
    grade: 2,
    label: 'الصف الثاني',
    emoji: '2️⃣',
    gradient: 'from-emerald-400 to-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    hoverBorder: 'hover:border-emerald-400',
    shadow: 'hover:shadow-emerald-200/60',
    textColor: 'text-emerald-700',
    character: '👦',
    desc: 'حصص تفاعلية للصف الثاني الأساسي',
  },
  {
    grade: 3,
    label: 'الصف الثالث',
    emoji: '3️⃣',
    gradient: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    hoverBorder: 'hover:border-purple-400',
    shadow: 'hover:shadow-purple-200/60',
    textColor: 'text-purple-700',
    character: '👧',
    desc: 'حصص تفاعلية للصف الثالث الأساسي',
  },
  {
    grade: 4,
    label: 'الصف الرابع',
    emoji: '4️⃣',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    hoverBorder: 'hover:border-amber-400',
    shadow: 'hover:shadow-amber-200/60',
    textColor: 'text-amber-700',
    character: '🧑',
    desc: 'حصص تفاعلية للصف الرابع الأساسي',
  },
];

export default function ClassesPage() {
  const [counts, setCounts] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });

  useEffect(() => {
    fetch('/api/classes?limit=100')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const c: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
          d.data.forEach((cls: { grade: number }) => { if (c[cls.grade] !== undefined) c[cls.grade]++ });
          setCounts(c);
        }
      })
      .catch(() => {});
  }, []);

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

          <div className="flex flex-col md:flex-row items-center gap-8">
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
                اختر صفك الدراسي وانضم إلى الحصص المباشرة!
                <br />
                <span className="text-blue-700 font-bold">التعليم الحديث في متناول يدك! 🎓</span>
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Cards */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center text-blue-700 mb-4">اختر صفك الدراسي</h2>
          <p className="text-xl text-center text-gray-600 font-bold mb-12">اضغط على صفك للدخول إلى الحصص</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GRADES.map((g, i) => (
              <motion.div
                key={g.grade}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
              >
                <Link href={`/classes/${g.grade}`} className="block group">
                  <div className={`relative ${g.bg} rounded-3xl p-8 border-3 ${g.border} ${g.hoverBorder} shadow-lg ${g.shadow} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}>
                    {/* Background decoration */}
                    <div className={`absolute -left-8 -bottom-8 w-40 h-40 bg-gradient-to-br ${g.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${g.gradient} rounded-full opacity-5 group-hover:opacity-15 transition-opacity`} />

                    <div className="relative z-10 flex items-center gap-5">
                      {/* Grade Icon */}
                      <div className={`w-20 h-20 bg-gradient-to-br ${g.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0`}>
                        <span className="text-4xl">{g.character}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{g.emoji}</span>
                          <h3 className={`text-2xl md:text-3xl font-black ${g.textColor}`}>{g.label}</h3>
                        </div>
                        <p className="text-gray-600 font-medium text-sm mb-2">{g.desc}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${g.gradient} text-white`}>
                            {counts[g.grade]} {counts[g.grade] === 1 ? 'حصة' : 'حصص'}
                          </span>
                          <span className={`text-xs font-bold ${g.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            ادخل ←
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${g.gradient} rounded-xl flex items-center justify-center text-white opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all flex-shrink-0`}>
                        <span className="text-xl">←</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
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
                <motion.div className="relative" animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }} transition={{ duration: 4, repeat: Infinity }}>
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

      {/* Visitor Counter */}
      <section className="py-8 px-4 bg-gradient-to-b from-cyan-50 to-blue-100">
        <div className="max-w-6xl mx-auto flex justify-center">
          <VisitorCounter pageName="classes" />
        </div>
      </section>
    </main>
  );
}
