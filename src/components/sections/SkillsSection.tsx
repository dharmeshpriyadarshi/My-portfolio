"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useXP } from "@/context/XPProvider";

interface SkillCategory {
    title: string;
    icon: string;
    skills: { name: string; level: number }[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
    {
        title: "Languages",
        icon: "⚔️",
        skills: [
            { name: "C++", level: 5 },
            { name: "Java", level: 5 },
            { name: "Python", level: 4 },
            { name: "TypeScript", level: 4 },
            { name: "Go", level: 3 },
            { name: "Rust", level: 2 },
        ],
    },
    {
        title: "Frameworks",
        icon: "🛠️",
        skills: [
            { name: "React", level: 4 },
            { name: "Next.js", level: 4 },
            { name: "Spring Boot", level: 3 },
            { name: "Node.js", level: 4 },
            { name: "TensorFlow", level: 3 },
        ],
    },
    {
        title: "Cloud & DevOps",
        icon: "☁️",
        skills: [
            { name: "AWS", level: 4 },
            { name: "Docker", level: 5 },
            { name: "Kubernetes", level: 3 },
            { name: "Terraform", level: 3 },
            { name: "CI/CD", level: 4 },
        ],
    },
    {
        title: "Tools & DBs",
        icon: "🗄️",
        skills: [
            { name: "Git", level: 5 },
            { name: "PostgreSQL", level: 4 },
            { name: "Redis", level: 3 },
            { name: "MongoDB", level: 3 },
            { name: "Linux", level: 4 },
        ],
    },
];

function EnchantLevel({ level }: { level: number }) {
    return (
        <div className="flex gap-[2px]">
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="w-2 h-3"
                    style={{
                        background: i <= level ? "#80ff20" : "#333",
                        boxShadow: i <= level ? "0 0 4px #80ff20" : "none",
                    }}
                />
            ))}
        </div>
    );
}

export default function SkillsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { sectionViewed } = useXP();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) sectionViewed("skills");
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [sectionViewed]);

    return (
        <section
            id="skills"
            ref={sectionRef}
            className="py-20 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-8"
        >
            <h2 className="text-xl md:text-2xl text-center text-white drop-shadow-[2px_2px_0_#000] mb-12">
                📖 Enchantment Table
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SKILL_CATEGORIES.map((category, catIdx) => (
                    <motion.div
                        key={category.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: catIdx * 0.1 }}
                        viewport={{ once: true }}
                        className="pixel-border p-4"
                        style={{ background: "#2a1a3a" }}
                    >
                        <h3 className="text-xs text-[--color-mc-enchant] mb-4 flex items-center gap-2">
                            <span>{category.icon}</span>
                            {category.title}
                        </h3>

                        <div className="space-y-2">
                            {category.skills.map((skill, i) => (
                                <motion.div
                                    key={skill.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: catIdx * 0.1 + i * 0.05 }}
                                    viewport={{ once: true }}
                                    className="flex items-center justify-between pixel-border-dark px-3 py-2 group hover:brightness-125 transition-all"
                                    style={{ background: "#1a1a2e" }}
                                >
                                    <span className="text-[9px] text-white/80 group-hover:text-white transition-colors">
                                        {skill.name}
                                    </span>
                                    <EnchantLevel level={skill.level} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Enchant shimmer overlay */}
                        <div className="enchant-shimmer h-1 mt-3 rounded-full opacity-60" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
