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
  link?: string;
  isComingSoon: boolean;
  isFeatured?: boolean;
  readTime?: number;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'حكايات عُمانية': Globe,
  'قصص الأنبياء': BookOpen,
  'قصص أخلاقية': Heart,
  'مغامرات مصورة': Lightbulb,
};

const CATEGORY_COLORS: Record<string, string> = {
  'حكايات عُمانية': 'from-amber-500 to-amber-700',
  'قصص الأنبياء': 'from-green-500 to-green-700',
  'قصص أخلاقية': 'from-pink-500 to-pink-700',
  'مغامرات مصورة': 'from-purple-500 to-purple-700',
};

const CATEGORY_BADGE: Record<string, string> = {
  'حكايات عُمانية': 'bg-amber-100 text-amber-700',
  'قصص الأنبياء': 'bg-green-100 text-green-700',
  'قصص أخلاقية': 'bg-pink-100 text-pink-700',
  'مغامرات مصورة': 'bg-purple-100 text-purple-700',
};

const STATIC_STORIES: ApiStory[] = [
  { _id: '1', title: "حكايات عُمانية قديمة", icon: "🌍", description: "قصص من التراث العُماني الأصيل", category: "حكايات عُمانية", color: "#F59E0B", isComingSoon: true },
  { _id: '2', title: "قصص الأنبياء", icon: "📖", description: "تعلم من قصص الأنبياء عليهم السلام", category: "قصص الأنبياء", color: "#10B981", isComingSoon: true },
  { _id: '3', title: "قصص أخلاقية", icon: "💚", description: "قصص تعلمك القيم والأخلاق الحميدة", category: "قصص أخلاقية", color: "#EC4899", isComingSoon: true },
  { _id: '4', title: "مغامرات مصورة", icon: "✨", description: "مغامرات شيقة ومثيرة", category: "مغامرات مصورة", color: "#8B5CF6", isComingSoon: true },
];

export default function StoriesPage() {
  const [stories, setStories] = useState<ApiStory[]>(STATIC_STORIES);
  const [loading, setLoading] = useState(true);

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

      {/* Hero */}
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
            <span>→</span><span>العودة للرئيسية</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story, index) => {
                const IconComponent = CATEGORY_ICONS[story.category] ?? BookOpen;
                const gradColor = CATEGORY_COLORS[story.category] ?? 'from-amber-500 to-amber-700';
                const badgeColor = CATEGORY_BADGE[story.category] ?? 'bg-amber-100 text-amber-700';
                const hasLink = !story.isComingSoon && !!story.link;

                return (
                  <motion.div
                    key={story._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-video overflow-hidden bg-slate-800">
                      {story.coverImage ? (
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradColor} flex items-center justify-center`}>
                          {story.icon ? (
                            <span className="text-7xl drop-shadow-lg">{story.icon}</span>
                          ) : (
                            <IconComponent className="w-20 h-20 text-white/80" />
                          )}
                        </div>
                      )}

                      {/* Hover overlay with read arrow */}
                      {hasLink && (
                        <a
                          href={story.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300"
                        >
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                            <BookOpen className="w-7 h-7 text-indigo-700" />
                          </div>
                        </a>
                      )}

                      {/* Coming soon overlay */}
                      {story.isComingSoon && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="bg-yellow-400 text-yellow-900 px-5 py-2.5 rounded-full font-black text-lg border-2 border-yellow-600 shadow-lg">
                            قريباً 🚀
                          </div>
                        </div>
                      )}

                      {/* Read time badge */}
                      {story.readTime && story.readTime > 0 && !story.isComingSoon && (
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md">
                          ⏱ {story.readTime} دقائق
                        </div>
                      )}

                      {/* Featured badge */}
                      {story.isFeatured && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-md">
                          ⭐ مميزة
                        </div>
                      )}
                    </div>

                    {/* Card Info */}
                    <div className="bg-white p-4">
                      <div className="mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                          {story.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-gray-800 mb-1 leading-snug">{story.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{story.description}</p>

                      {story.isComingSoon ? (
                        <button
                          disabled
                          className="w-full px-4 py-2.5 bg-gray-200 text-gray-400 rounded-xl font-bold cursor-not-allowed text-sm"
                        >
                          قريباً 🚀
                        </button>
                      ) : hasLink ? (
                        <a
                          href={story.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r ${gradColor} text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-sm`}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>اقرأ الآن</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full px-4 py-2.5 bg-gray-200 text-gray-400 rounded-xl font-bold cursor-not-allowed text-sm"
                        >
                          قريباً
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
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

      {/* Visitor Counter */}
      <section className="py-8 px-4 bg-gradient-to-b from-indigo-900/50 to-yellow-900/30">
        <div className="max-w-6xl mx-auto flex justify-center">
          <VisitorCounter pageName="stories" />
        </div>
      </section>
    </main>
  );
}
