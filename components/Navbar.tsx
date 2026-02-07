"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Gamepad2, Tv, Book, Trophy, Moon, Flower2, Home } from "lucide-react";

const navItems = [
    { name: "الرئيسية", icon: Home, href: "/", color: "text-gray-700", bgColor: "bg-gray-100" },
    { name: "الألعاب", icon: Gamepad2, href: "/games", color: "text-blue-500", bgColor: "bg-blue-100" },
    { name: "المشاهدة", icon: Tv, href: "/watch", color: "text-pink-500", bgColor: "bg-pink-100" },
    { name: "القصص", icon: Book, href: "/stories", color: "text-amber-600", bgColor: "bg-amber-100" },
    { name: "التحدي", icon: Trophy, href: "/challenges", color: "text-yellow-500", bgColor: "bg-yellow-100" },
    { name: "إسلاميات", icon: Moon, href: "/oasis", color: "text-purple-500", bgColor: "bg-purple-100" },
    { name: "منوعات", icon: Flower2, href: "/variety", color: "text-green-500", bgColor: "bg-green-100" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-2 md:top-4 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md rounded-full px-3 md:px-5 py-2 md:py-3 shadow-xl border-2 border-white/40 w-[98%] md:w-auto max-w-5xl"
            role="navigation"
            aria-label="القائمة الرئيسية"
        >
            <ul className="flex items-center justify-between md:justify-center gap-1 md:gap-2 overflow-x-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.name} className="shrink-0">
                            <Link
                                href={item.href}
                                aria-label={`الانتقال إلى ${item.name}`}
                                className={cn(
                                    "relative flex flex-col items-center justify-center px-3 py-2 md:px-4 md:py-2.5 rounded-xl transition-all group min-w-[65px] md:min-w-[70px]",
                                    isActive
                                        ? `${item.bgColor} shadow-md scale-105`
                                        : "hover:bg-gray-100 focus:bg-gray-100",
                                    "focus:outline-none focus:ring-2 focus:ring-offset-1",
                                    isActive ? "focus:ring-" + item.color.split("-")[1] + "-500" : "focus:ring-blue-500"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "w-6 h-6 md:w-7 md:h-7 mb-1 transition-all",
                                        isActive ? `${item.color} scale-110` : "text-gray-600 group-hover:scale-110"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "text-[10px] md:text-xs font-bold transition-colors",
                                        isActive ? item.color : "text-gray-600"
                                    )}
                                >
                                    {item.name}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-current to-transparent rounded-full"
                                        style={{ color: item.color.replace('text-', '') }}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </motion.nav>
    );
}
