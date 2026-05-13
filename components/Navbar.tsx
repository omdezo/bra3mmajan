"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
    { name: "الرئيسية", href: "/", emoji: "🏠", gradient: "from-purple-400 to-purple-600", bg: "bg-purple-50" },
    { name: "الألعاب", href: "/games", emoji: "🎮", gradient: "from-blue-400 to-blue-600", bg: "bg-blue-50" },
    { name: "المشاهدة", href: "/watch", emoji: "📺", gradient: "from-pink-400 to-pink-600", bg: "bg-pink-50" },
    { name: "القصص", href: "/stories", emoji: "📚", gradient: "from-orange-400 to-orange-600", bg: "bg-orange-50" },
    { name: "التحدي", href: "/challenges", emoji: "🏆", gradient: "from-yellow-400 to-yellow-600", bg: "bg-yellow-50" },
    { name: "إسلاميات", href: "/oasis", emoji: "🌙", gradient: "from-indigo-400 to-indigo-600", bg: "bg-indigo-50" },
    { name: "منوعات", href: "/variety", emoji: "🎨", gradient: "from-green-400 to-green-600", bg: "bg-green-50" },
    { name: "حصص افتراضية", href: "/classes", emoji: "💻", gradient: "from-cyan-400 to-blue-600", bg: "bg-cyan-50" },
    { name: "اتصل بنا", href: "/contact", emoji: "📞", gradient: "from-rose-400 to-pink-600", bg: "bg-rose-50" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
            role="navigation"
            aria-label="القائمة الرئيسية"
        >
            <div className="bg-white/95 backdrop-blur-xl rounded-full px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-2 border-white/60">
                <ul className="flex items-center gap-2" dir="rtl">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.name}>
                                <Link href={item.href} aria-label={`الانتقال إلى ${item.name}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`
                                            relative flex items-center gap-2 px-4 py-2 rounded-full
                                            transition-all duration-300
                                            ${isActive
                                                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                                                : `${item.bg} hover:bg-opacity-100 text-gray-700`
                                            }
                                        `}
                                    >
                                        {/* Emoji */}
                                        <span className="text-xl">
                                            {item.emoji}
                                        </span>

                                        {/* Label */}
                                        <span className="text-sm font-bold whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    </motion.div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </motion.nav>
    );
}
