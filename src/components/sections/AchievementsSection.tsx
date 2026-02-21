"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useXP } from "@/context/XPProvider";

interface Achievement {
    id: string;
    icon: string;
    title: string;
    description: string;
}

const ACHIEVEMENTS: Achievement[] = [
    {
        id: "a1",
        icon: "🎓",
        title: "Scholar",
        description: "Expected B.S. in Computer Science — May 2026",
    },
    {
        id: "a2",
        icon: "💼",
        title: "First Job",
        description: "Landed first software engineering internship",
    },
    {
        id: "a3",
        icon: "🏆",
        title: "Hackathon Hero",
        description: "Won 1st place at University Hackathon",
    },
    {
        id: "a4",
        icon: "⭐",
        title: "Open Source Star",
        description: "Open source project reached 100+ stars",
    },
    {
        id: "a5",
        icon: "🎯",
        title: "Dean's List",
        description: "Made the Dean's List for academic excellence",
    },
];

function AchievementToast({ achievement }: { achievement: Achievement }) {
    return (
        <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[300]"
        >
            <div
                className="pixel-border flex items-center gap-4 px-5 py-3 achievement-toast"
                style={{ background: "#2a2a3e" }}
            >
                <div
                    className="w-10 h-10 pixel-border-dark flex items-center justify-center text-xl"
                    style={{ background: "#8b8b8b" }}
                >
                    {achievement.icon}
                </div>
                <div>
                    <p className="text-[8px] text-[--color-mc-gold]">Achievement Get!</p>
                    <p className="text-[10px] text-white mt-1">{achievement.title}</p>
                </div>
            </div>
        </motion.div>
    );
}

export default function AchievementsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { sectionViewed } = useXP();
    const [activeToast, setActiveToast] = useState<Achievement | null>(null);
    const shownToasts = useRef<Set<string>>(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) sectionViewed("achievements");
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [sectionViewed]);

    const triggerToast = (achievement: Achievement) => {
        if (shownToasts.current.has(achievement.id)) return;
        shownToasts.current.add(achievement.id);
        setActiveToast(achievement);
        setTimeout(() => setActiveToast(null), 4000);
    };

    return (
        <>
            {/* Toast */}
            {activeToast && <AchievementToast achievement={activeToast} />}

            <section
                id="achievements"
                ref={sectionRef}
                className="py-20 px-4 md:px-8 max-w-4xl mx-auto scroll-mt-8"
            >
                <h2 className="text-xl md:text-2xl text-center text-white drop-shadow-[2px_2px_0_#000] mb-12">
                    🏆 Achievements
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ACHIEVEMENTS.map((ach, i) => (
                        <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{
                                opacity: 1,
                                scale: 1,
                            }}
                            onViewportEnter={() => triggerToast(ach)}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true, amount: 0.8 }}
                            className="pixel-border p-4 flex items-center gap-4 hover:brightness-110 transition-all cursor-default"
                            style={{ background: "#2a2a3e" }}
                        >
                            <div
                                className="w-12 h-12 pixel-border-dark flex items-center justify-center text-2xl flex-shrink-0"
                                style={{ background: "#8b8b8b" }}
                            >
                                {ach.icon}
                            </div>
                            <div>
                                <p className="text-[10px] text-[--color-mc-gold]">{ach.title}</p>
                                <p className="text-[8px] text-white/60 mt-1">{ach.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </>
    );
}
