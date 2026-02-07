"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Gamepad2, Tv, Book, Trophy, Moon, Flower2, Home } from "lucide-react";

const navItems = [
    { name: "الرئيسية", icon: Home, href: "/" },
    { name: "الألعاب", icon: Gamepad2, href: "#games", color: "text-blue-500" },
    { name: "المشاهدة", icon: Tv, href: "#watch", color: "text-pink-500" },
    { name: "القصص", icon: Book, href: "#stories", color: "text-amber-600" },
    { name: "التحدي", icon: Trophy, href: "#challenges", color: "text-yellow-500" },
    { name: "إسلاميات", icon: Moon, href: "#oasis", color: "text-purple-500" },
    { name: "منوعات", icon: Flower2, href: "#variety", color: "text-green-500" },
];

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-2 md:top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-full px-4 md:px-6 py-2 md:py-3 shadow-lg border border-white/20 w-[98%] md:w-[95%] max-w-4xl"
            role="navigation"
            aria-label="القائمة الرئيسية"
        >
            <ul className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                {navItems.map((item) => (
                    <li key={item.name} className="shrink-0">
                        <Link
                            href={item.href}
                            aria-label={`الانتقال إلى ${item.name}`}
                            className={cn(
                                "flex flex-col items-center justify-center p-3 md:p-2 rounded-xl transition-all hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 group min-w-[70px] md:min-w-[60px]",
                                item.color
                            )}
                        >
                            <item.icon className="w-7 h-7 md:w-6 md:h-6 mb-1 transition-transform group-hover:scale-110" />
                            <span className="text-xs md:text-[10px] font-bold text-gray-700">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </motion.nav>
    );
}
