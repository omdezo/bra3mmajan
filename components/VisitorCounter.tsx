"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface VisitorCounterProps {
    pageName: string;
}

export function VisitorCounter({ pageName }: VisitorCounterProps) {
    const [visits, setVisits] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Get current visit count from localStorage
        const storageKey = `visits_${pageName}`;
        const currentVisits = parseInt(localStorage.getItem(storageKey) || "0", 10);
        const newVisits = currentVisits + 1;

        // Update localStorage
        localStorage.setItem(storageKey, newVisits.toString());

        // Set state
        setVisits(newVisits);
        setIsLoaded(true);
    }, [pageName]);

    if (!isLoaded) {
        return null; // Prevent hydration mismatch
    }

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
                    {visits.toLocaleString('ar-EG')}
                </motion.span>
            </div>
        </motion.div>
    );
}
