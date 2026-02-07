"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollSectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

const fadeInScale: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            staggerChildren: 0.2
        }
    }
};

export function ScrollSection({ children, className, id }: ScrollSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 1", "0.8 1"]
    });

    return (
        <motion.section
            ref={ref}
            id={id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
            variants={fadeInScale}
            className={cn(
                "min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden py-20 px-4",
                className
            )}
        >
            {children}
        </motion.section>
    );
}
