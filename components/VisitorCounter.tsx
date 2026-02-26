"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toArabicNumerals } from "@/lib/arabicNumbers";

interface VisitorCounterProps {
  pageName: string;
  pageRoute?: string;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem("baraem_session_id");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("baraem_session_id", id);
  }
  return id;
}

export function VisitorCounter({ pageName, pageRoute }: VisitorCounterProps) {
  const [visits, setVisits] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const page = pageRoute ?? pageName;
    const sessionId = getSessionId();

    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, pageName, sessionId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setVisits(d.data.totalVisits ?? 0);
        } else {
          // Fallback to localStorage
          const key = `visits_${page}`;
          const current = parseInt(localStorage.getItem(key) ?? "0", 10) + 1;
          localStorage.setItem(key, String(current));
          setVisits(current);
        }
      })
      .catch(() => {
        const key = `visits_${page}`;
        const current = parseInt(localStorage.getItem(key) ?? "0", 10) + 1;
        localStorage.setItem(key, String(current));
        setVisits(current);
      })
      .finally(() => setIsLoaded(true));
  }, [pageName, pageRoute]);

  if (!isLoaded) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg border-4 border-white/30"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Eye className="w-5 h-5" />
      </motion.div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm md:text-base">عدد الزوار:</span>
        <motion.span
          key={visits}
          initial={{ scale: 1.5, color: "#FFD700" }}
          animate={{ scale: 1, color: "#FFFFFF" }}
          className="font-black text-lg md:text-xl"
        >
          {toArabicNumerals(visits)}
        </motion.span>
      </div>
    </motion.div>
  );
}
