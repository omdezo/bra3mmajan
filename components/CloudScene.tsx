"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CloudProps {
    depth: number; // 0 (back) to 1 (front)
    index: number;
}

function Cloud({ depth, index }: CloudProps) {
    const size = 100 + Math.random() * 200 * depth; // Larger clouds in front
    const initialX = Math.random() * 100; // Random horizontal position %
    const initialY = Math.random() * 100; // Random vertical position %
    const duration = 20 + Math.random() * 10;

    // Parallax effect: faster movement for closer clouds
    const { scrollY } = useScroll();
    const yResult = useTransform(scrollY, [0, 1000], [0, -200 * (depth + 0.5)]);

    return (
        <motion.div
            style={{
                width: size,
                height: size * 0.6,
                left: `${initialX}%`,
                top: `${initialY}%`,
                y: yResult,
                zIndex: Math.floor(depth * 40), // 0 to 40
            }}
            animate={{
                x: [0, 20, 0],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={cn(
                "absolute rounded-full bg-white/80 blur-xl",
                depth > 0.8 ? "bg-white/90 blur-lg" : "bg-white/40 blur-2xl"
            )}
        />
    );
}

export function CloudScene() {
    // Generate a stable set of clouds
    const [clouds, setClouds] = useState<{ depth: number; id: number }[]>([]);

    useEffect(() => {
        const newClouds = Array.from({ length: 15 }).map((_, i) => ({
            depth: Math.random(),
            id: i,
        }));
        setClouds(newClouds);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {clouds.map((cloud) => (
                <Cloud key={cloud.id} depth={cloud.depth} index={cloud.id} />
            ))}

            {/* Massive bottom cloud bank to transition to content */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent blur-md z-20" />
        </div>
    );
}
