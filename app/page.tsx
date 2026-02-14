"use client";

import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { CloudScene } from "@/components/CloudScene";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GamesSection } from "@/components/featured/GamesSection";
import { WatchSection } from "@/components/featured/WatchSection";
import { StoriesSection } from "@/components/featured/StoriesSection";
import { ChallengesSection } from "@/components/featured/ChallengesSection";
import { OasisSection } from "@/components/featured/OasisSection";
import { VarietySection } from "@/components/featured/VarietySection";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Sky gradient transition: Day -> Sunset -> Night
  const background = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    ["linear-gradient(to bottom, #87CEEB, #E0F7FA)", "linear-gradient(to bottom, #FFD700, #FF6B6B)", "linear-gradient(to bottom, #2C3E50, #000000)", "#000000"]
  );

  return (
    <motion.main ref={containerRef} style={{ background }} className="relative">
      <Navbar />

      {/* Cloud Hero Section - Skyfall Adventure */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden" aria-label="قسم البداية - براعم مجان">
        <CloudScene />

        <div className="z-20 text-center relative px-4">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative w-64 h-64 md:w-96 md:h-96 mx-auto mb-8"
          >
            <Image
              src="/assets/logo.png"
              alt="Baraem Majan Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
              loading="eager"
              quality={100}
            />
          </motion.div>
          <motion.h1
            className="text-5xl md:text-8xl font-black text-white text-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)] tracking-tight"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            بَراعِم مَجان
          </motion.h1>
          <p className="text-xl md:text-2xl lg:text-4xl text-white font-bold text-center mt-6 drop-shadow-lg animate-pulse px-4">
            المستقبل ليس مكاناً نذهب إليه، بل هو شيء نصنعه معاً.
          </p>
          <div className="mt-12 animate-bounce" role="status" aria-live="polite">
            <span className="text-white text-base md:text-lg">مرر للأسفل للهبوط في عالمنا</span>
            <div className="w-1 h-12 bg-white/50 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </section>

      {/* Creative Sections Integration */}
      <div className="relative z-30">

        {/* Games: The Claw Machine */}
        <div id="games">
          <GamesSection />
        </div>

        {/* Watch: Popcorn Cinema */}
        <div id="watch">
          <WatchSection />
        </div>

        {/* Stories: The Magic Lamp */}
        <div id="stories">
          <StoriesSection />
        </div>

        {/* Challenges: The Maze Master */}
        <div id="challenges">
          <ChallengesSection />
        </div>

        {/* Oasis: The Blooming Crescent */}
        <div id="oasis">
          <OasisSection />
        </div>

        {/* Variety: The Hot Air Balloon */}
        <div id="variety">
          <VarietySection />
        </div>

      </div>

      <footer className="w-full bg-[#FFB580] py-16 text-center relative z-20 border-t-4 border-purple-500" dir="rtl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="relative w-full max-w-6xl mx-auto h-64 md:h-80 lg:h-96 mb-8">
            <Image
              src="/assets/مدرسة مجـــــان للتعليم الأساسي الصفوف (1-4).jpg"
              alt="مدرسة مجـــــان للتعليم الأساسي الصفوف (1-4)"
              fill
              className="object-contain"
            />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-6" />
          <p className="text-base md:text-lg text-gray-800 font-bold">
            جميع الحقوق محفوظة © براعم مجان 2026
          </p>
        </div>
      </footer>
    </motion.main>
  );
}
