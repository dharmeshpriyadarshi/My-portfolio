"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useXP } from "@/context/XPProvider";

interface TimelineEntry {
    id: string;
    date: string;
    title: string;
    org: string;
    description: string;
    icon: string;
}

const TIMELINE: TimelineEntry[] = [
    {
        id: "t1",
        date: "May 2026",
        title: "B.S. Computer Science",
        org: "University",
        description: "Expected graduation with honors. Focus on systems programming, algorithms, and cloud computing.",
        icon: "🎓",
    },
    {
        id: "t2",
        date: "Summer 2025",
        title: "Software Engineering Intern",
        org: "Tech Company",
        description: "Built high-performance backend services in C++ and Java. Designed cloud infrastructure using AWS.",
        icon: "💼",
    },
    {
        id: "t3",
        date: "2024 - Present",
        title: "Project Lead",
        org: "Open Source",
        description: "Leading development of data processing tools. Managing a team of 5 contributors.",
        icon: "🔧",
    },
    {
        id: "t4",
        date: "2023",
        title: "Teaching Assistant",
        org: "CS Department",
        description: "Tutored 200+ students in Data Structures and Algorithms. Created automated grading tools.",
        icon: "📚",
    },
    {
        id: "t5",
        date: "2022",
        title: "Started Coding Journey",
        org: "Self-taught",
        description: "Wrote my first 'Hello World' in C++. Built my first game in Java. The adventure begins!",
        icon: "⭐",
    },
];

export default function TimelineSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { sectionViewed } = useXP();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) sectionViewed("experience");
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [sectionViewed]);

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="py-20 px-4 md:px-8 max-w-4xl mx-auto scroll-mt-8"
        >
            <h2 className="text-xl md:text-2xl text-center text-white drop-shadow-[2px_2px_0_#000] mb-12">
                🗺️ Adventure Log
            </h2>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div
                    className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2"
                    style={{ background: "#5d9b37", imageRendering: "pixelated" }}
                />

                {TIMELINE.map((entry, i) => (
                    <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.5 }}
                        viewport={{ once: true }}
                        className={`relative flex mb-10 ${i % 2 === 0
                                ? "md:flex-row flex-row"
                                : "md:flex-row-reverse flex-row"
                            }`}
                    >
                        {/* Waypoint marker */}
                        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                            <div
                                className="w-10 h-10 pixel-border flex items-center justify-center text-lg"
                                style={{ background: "#5d9b37" }}
                            >
                                {entry.icon}
                            </div>
                        </div>

                        {/* Content card */}
                        <div
                            className={`ml-16 md:ml-0 pixel-border p-4 ${i % 2 === 0
                                    ? "md:mr-[calc(50%+2rem)] md:ml-0"
                                    : "md:ml-[calc(50%+2rem)] md:mr-0"
                                } w-full max-w-md`}
                            style={{ background: "#2a2a3e" }}
                        >
                            <p className="text-[8px] text-[--color-mc-xp-green] mb-1">
                                {entry.date}
                            </p>
                            <h3 className="text-[11px] text-[--color-mc-gold] mb-1">
                                {entry.title}
                            </h3>
                            <p className="text-[9px] text-[--color-mc-aqua] mb-2">
                                {entry.org}
                            </p>
                            <p className="text-[8px] text-white/70 leading-relaxed">
                                {entry.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
