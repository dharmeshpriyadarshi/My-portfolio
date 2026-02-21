"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useXP } from "@/context/XPProvider";

interface ArmorSlot {
    label: string;
    value: string;
    icon: string;
    color: string;
}

const ARMOR_SLOTS: ArmorSlot[] = [
    { label: "Helmet", value: "Logic & Analysis", icon: "⛑️", color: "#4FC3F7" },
    { label: "Chestplate", value: "Perseverance", icon: "🛡️", color: "#FFD700" },
    { label: "Leggings", value: "Creativity", icon: "👖", color: "#AB47BC" },
    { label: "Boots", value: "Adaptability", icon: "👢", color: "#66BB6A" },
];

const STATS = [
    { label: "Attack", value: "C++ / Java / Python" },
    { label: "Defense", value: "Cloud & DevOps" },
    { label: "Speed", value: "Fast Learner" },
    { label: "Luck", value: "Problem Solver" },
];

export default function CharacterMenu() {
    const sectionRef = useRef<HTMLElement>(null);
    const { sectionViewed } = useXP();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) sectionViewed("about");
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [sectionViewed]);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="py-20 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-8"
        >
            {/* Section Title */}
            <h2 className="text-xl md:text-2xl text-center text-white drop-shadow-[2px_2px_0_#000] mb-12">
                ⚔ Character Menu
            </h2>

            <div
                className="pixel-border p-4 md:p-8"
                style={{ background: "#c6c6c6" }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Avatar */}
                    <div className="flex flex-col items-center justify-center">
                        <div
                            className="w-32 h-48 md:w-40 md:h-56 pixel-border-dark flex items-center justify-center"
                            style={{ background: "#8b8b8b" }}
                        >
                            {/* Pixel avatar using CSS blocks */}
                            <div className="relative" style={{ imageRendering: "pixelated" }}>
                                {/* Head */}
                                <div className="w-12 h-12 bg-[#c69c6d] mx-auto border-2 border-[#8b6914]">
                                    <div className="flex justify-between px-1 pt-2">
                                        <div className="w-2 h-2 bg-[#333]" />
                                        <div className="w-2 h-2 bg-[#333]" />
                                    </div>
                                    <div className="w-3 h-1 bg-[#b5856a] mx-auto mt-1" />
                                </div>
                                {/* Body */}
                                <div className="w-10 h-12 bg-[#4FC3F7] mx-auto border-2 border-[#2196F3]" />
                                {/* Legs */}
                                <div className="flex justify-center gap-1">
                                    <div className="w-4 h-8 bg-[#1565C0] border border-[#0D47A1]" />
                                    <div className="w-4 h-8 bg-[#1565C0] border border-[#0D47A1]" />
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-[10px] text-[#333] text-center">
                            Dharm • Level ???
                        </p>
                    </div>

                    {/* Right: Armor Slots */}
                    <div className="space-y-3">
                        <h3 className="text-xs text-[#333] mb-4 text-center md:text-left">
                            Equipment (Core Values)
                        </h3>
                        {ARMOR_SLOTS.map((slot, i) => (
                            <motion.div
                                key={slot.label}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 pixel-border-dark p-2"
                                style={{ background: "#8b8b8b" }}
                            >
                                <div
                                    className="w-10 h-10 flex items-center justify-center pixel-border text-lg"
                                    style={{ background: "#555" }}
                                >
                                    {slot.icon}
                                </div>
                                <div>
                                    <p className="text-[9px] text-[#555]">{slot.label}</p>
                                    <p className="text-[10px] font-bold" style={{ color: slot.color }}>
                                        {slot.value}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Stats */}
                        <div className="mt-6 pt-4 border-t-2 border-[#aaa]">
                            <h3 className="text-xs text-[#333] mb-3 text-center md:text-left">Stats</h3>
                            {STATS.map((stat) => (
                                <div key={stat.label} className="flex justify-between text-[9px] text-[#444] py-1">
                                    <span>{stat.label}:</span>
                                    <span className="text-[#333]">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
