"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Book, Heart, Sun, Moon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";
import { useState, useEffect } from "react";
import JuzAmmaSection from "@/components/oasis/JuzAmmaSection";
import AdhkarSection from "@/components/oasis/AdhkarSection";

interface ApiOasis {
  _id: string;
  title: string;
  arabicText: string;
  meaning?: string;
  transliteration?: string;
  category: string;
  icon: string;
  color: string;
  audioUrl?: string;
  isComingSoon: boolean;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'حفظ القرآن': Book,
  'أدعية إسلامية': Heart,
  'أذكار الصباح والمساء': Sun,
  'آداب إسلامية': Moon,
};

const BG_COLORS = [
  "bg-green-100", "bg-blue-100", "bg-yellow-100", "bg-purple-100",
  "bg-teal-100", "bg-emerald-100", "bg-cyan-100", "bg-lime-100",
];

const GRADIENT_COLORS = [
  "from-green-500 to-green-700", "from-blue-500 to-blue-700",
  "from-yellow-500 to-yellow-700", "from-purple-500 to-purple-700",
  "from-teal-500 to-teal-700", "from-emerald-500 to-emerald-700",
];

const STATIC_OASIS: ApiOasis[] = [
  { _id: '1', title: "تحفيظ جزء عمّ", icon: "📖", arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", description: "احفظ القرآن الكريم بطريقة سهلة وممتعة", category: "حفظ القرآن", color: "#10B981", isComingSoon: true } as ApiOasis & { description: string },
  { _id: '2', title: "أدعية الطفل المسلم", icon: "🤲", arabicText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", description: "تعلم الأدعية اليومية والمأثورة", category: "أدعية إسلامية", color: "#3B82F6", isComingSoon: true } as ApiOasis & { description: string },
  { _id: '3', title: "أذكار الصباح والمساء", icon: "☀️", arabicText: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", description: "احفظ أذكارك اليومية", category: "أذكار الصباح والمساء", color: "#F59E0B", isComingSoon: true } as ApiOasis & { description: string },
  { _id: '4', title: "آداب إسلامية", icon: "🌙", arabicText: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", description: "تعلم الآداب الإسلامية الجميلة", category: "آداب إسلامية", color: "#8B5CF6", isComingSoon: true } as ApiOasis & { description: string },
];

export default function OasisPage() {
  const [items, setItems] = useState<ApiOasis[]>(STATIC_OASIS);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ApiOasis | null>(null);

  useEffect(() => {
    fetch('/api/oasis?limit=20')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setItems(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
              style={{ top: `${(i * 47 + 13) % 100}%`, left: `${(i * 37 + 23) % 100}%` }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: (i % 3) + 2, repeat: Infinity }}
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
              <Image src="/assets/نور.png" alt="نور" fill className="object-contain drop-shadow-2xl" />
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

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item, index) => {
                const IconComponent = CATEGORY_ICONS[item.category] ?? Book;
                const bgColor = BG_COLORS[index % BG_COLORS.length];
                const gradColor = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="relative group"
                  >
                    <div className={`${bgColor} rounded-3xl p-8 border-4 border-green-400 shadow-xl hover:shadow-2xl transition-all`}>
                      <div className={`w-20 h-20 bg-gradient-to-br ${gradColor} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                        {item.icon ? (
                          <span className="text-4xl">{item.icon}</span>
                        ) : (
                          <IconComponent className="w-10 h-10 text-white" />
                        )}
                      </div>

                      <h3 className="text-3xl font-black text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-sm font-bold text-green-700 mb-4">{item.category}</p>

                      {/* Arabic text preview */}
                      <div className="bg-white/60 rounded-2xl p-4 mb-4 border-2 border-green-200">
                        <p className="text-xl font-bold text-gray-800 leading-relaxed text-center">
                          {item.arabicText}
                        </p>
                        {item.meaning && (
                          <p className="text-sm text-gray-600 mt-2 text-center">{item.meaning}</p>
                        )}
                      </div>

                      {item.isComingSoon ? (
                        <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 rounded-full font-bold cursor-not-allowed">
                          قريباً 🚀
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelected(item)}
                          className={`px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}
                        >
                          {item.audioUrl ? '🔊 استمع' : '📖 تعلم الآن'}
                        </button>
                      )}

                      {item.isComingSoon && (
                        <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-black text-sm border-2 border-yellow-600">
                          قريباً
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selected && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelected(null)}
        >
          <motion.div
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-8 border-green-500 shadow-2xl max-w-lg w-full p-8"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{selected.icon || '🌸'}</div>
              <h3 className="text-3xl font-black text-green-900 mb-2">{selected.title}</h3>
              <p className="text-sm text-green-700 font-bold mb-6">{selected.category}</p>

              <div className="bg-white/80 p-6 rounded-2xl border-4 border-green-400 mb-4">
                <p className="text-2xl font-bold text-green-900 leading-relaxed">{selected.arabicText}</p>
              </div>

              {selected.transliteration && (
                <p className="text-gray-600 italic mb-4">{selected.transliteration}</p>
              )}
              {selected.meaning && (
                <div className="bg-green-100 p-4 rounded-xl mb-4">
                  <p className="text-green-800 font-bold">{selected.meaning}</p>
                </div>
              )}
              {selected.audioUrl && (
                <audio controls className="w-full mb-4" src={selected.audioUrl} />
              )}

              <button
                onClick={() => setSelected(null)}
                className="px-8 py-3 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 transition-all active:scale-95"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Juz Amma Section — lazy loaded */}
      <JuzAmmaSection />

      {/* Adhkar Section — lazy loaded */}
      <AdhkarSection />

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

      {/* Visitor Counter */}
      <section className="py-8 px-4 bg-gradient-to-b from-teal-900/50 to-green-900/50">
        <div className="max-w-6xl mx-auto flex justify-center">
          <VisitorCounter pageName="oasis" />
        </div>
      </section>
    </main>
  );
}
