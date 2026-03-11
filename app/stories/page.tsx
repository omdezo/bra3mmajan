"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Heart, Lightbulb, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { VisitorCounter } from "@/components/VisitorCounter";
import { useState, useEffect } from "react";

interface ApiStory {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  coverImage?: string;
  content?: string;
  isComingSoon: boolean;
  readTime?: number;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'حكايات عُمانية': Globe,
  'قصص الأنبياء': BookOpen,
  'قصص أخلاقية': Heart,
  'مغامرات مصورة': Lightbulb,
};

const BG_COLORS = [
  "bg-amber-100", "bg-green-100", "bg-pink-100", "bg-purple-100",
  "bg-blue-100", "bg-yellow-100", "bg-indigo-100", "bg-red-100",
];

const GRADIENT_COLORS = [
  "from-amber-500 to-amber-700", "from-green-500 to-green-700",
  "from-pink-500 to-pink-700", "from-purple-500 to-purple-700",
  "from-blue-500 to-blue-700", "from-yellow-500 to-yellow-700",
];

const STATIC_STORIES: ApiStory[] = [
  { _id: '1', title: "حكايات عُمانية قديمة", icon: "🌍", description: "قصص من التراث العُماني الأصيل", category: "حكايات عُمانية", color: "#F59E0B", isComingSoon: true },
  { _id: '2', title: "قصص الأنبياء", icon: "📖", description: "تعلم من قصص الأنبياء عليهم السلام", category: "قصص الأنبياء", color: "#10B981", isComingSoon: true },
  { _id: '3', title: "قصص أخلاقية", icon: "💚", description: "قصص تعلمك القيم والأخلاق الحميدة", category: "قصص أخلاقية", color: "#EC4899", isComingSoon: true },
  { _id: '4', title: "مغامرات مصورة", icon: "✨", description: "مغامرات شيقة ومثيرة", category: "مغامرات مصورة", color: "#8B5CF6", isComingSoon: true },
];

export default function StoriesPage() {
  const [stories, setStories] = useState<ApiStory[]>(STATIC_STORIES);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<ApiStory | null>(null);

  useEffect(() => {
    fetch('/api/stories?limit=20')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setStories(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
              style={{ top: `${(i * 47 + 13) % 100}%`, left: `${(i * 37 + 23) % 100}%` }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: (i % 3) + 2, repeat: Infinity }}
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
              <Image src="/assets/جدّي سالم.png" alt="جدي سالم" fill className="object-contain drop-shadow-2xl" />
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

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stories.map((story, index) => {
                const IconComponent = CATEGORY_ICONS[story.category] ?? BookOpen;
                const bgColor = BG_COLORS[index % BG_COLORS.length];
                const gradColor = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
                return (
                  <motion.div
                    key={story._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="relative group"
                  >
                    <div className={`${bgColor} rounded-3xl p-8 border-4 border-yellow-400 shadow-xl hover:shadow-2xl transition-all`}>
                      {story.coverImage ? (
                        <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-6">
                          <Image src={story.coverImage} alt={story.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className={`w-20 h-20 bg-gradient-to-br ${gradColor} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                          {story.icon ? (
                            <span className="text-4xl">{story.icon}</span>
                          ) : (
                            <IconComponent className="w-10 h-10 text-white" />
                          )}
                        </div>
                      )}

                      <h3 className="text-3xl font-black text-gray-800 mb-2">{story.title}</h3>
                      <p className="text-sm font-bold text-indigo-600 mb-2">{story.category}</p>
                      {story.readTime && (
                        <p className="text-sm text-gray-500 mb-2">⏱ {story.readTime} دقائق للقراءة</p>
                      )}
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">{story.description}</p>

                      {story.isComingSoon ? (
                        <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 rounded-full font-bold cursor-not-allowed">
                          قريباً 🚀
                        </button>
                      ) : story.content ? (
                        <button
                          onClick={() => setSelectedStory(story)}
                          className={`px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}
                        >
                          اقرأ الآن 📖
                        </button>
                      ) : (
                        <button className={`px-6 py-3 bg-gradient-to-r ${gradColor} text-white rounded-full font-bold hover:shadow-lg transition-all active:scale-95`}>
                          اقرأ الآن
                        </button>
                      )}

                      {story.isComingSoon && (
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

      {/* Story Reader Modal */}
      {selectedStory && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedStory(null)}
        >
          <motion.div
            className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl border-8 border-yellow-500 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <button
                onClick={() => setSelectedStory(null)}
                className="px-4 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600"
              >
                ✕ إغلاق
              </button>
              <h3 className="text-3xl font-black text-amber-900">{selectedStory.title}</h3>
            </div>
            <div className="prose prose-lg max-w-none text-right text-gray-800 leading-relaxed whitespace-pre-wrap">
              {selectedStory.content}
            </div>
          </motion.div>
        </motion.div>
      )}

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

      {/* Visitor Counter */}
      <section className="py-8 px-4 bg-gradient-to-b from-indigo-900/50 to-yellow-900/30">
        <div className="max-w-6xl mx-auto flex justify-center">
          <VisitorCounter pageName="stories" />
        </div>
      </section>
    </main>
  );
}
