"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/components/sections/ChestInventory";

const RARITY_COLORS: Record<string, string> = {
    common: "#aaa",
    uncommon: "#55ff55",
    rare: "#5555ff",
    epic: "#aa00aa",
    legendary: "#ffaa00",
};

interface Props {
    project: Project | null;
    onClose: () => void;
}

/* Animated health bar that drains to 0 */
function HealthBar({ rarity }: { rarity: string }) {
    const [hp, setHP] = useState(100);

    useEffect(() => {
        setHP(100);
        // Start draining after a beat
        const t1 = setTimeout(() => setHP(35), 400);
        const t2 = setTimeout(() => setHP(0), 1200);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <div className="w-full h-5 pixel-border-dark relative overflow-hidden" style={{ background: "#222" }}>
            <motion.div
                className="h-full"
                initial={{ width: "100%" }}
                animate={{ width: `${hp}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                    background: hp > 35
                        ? "#55ff55"
                        : hp > 0
                            ? "#ffaa00"
                            : "#ff5555",
                }}
            />
            {/* HP text */}
            <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white drop-shadow-[1px_1px_0_#000]">
                {hp > 0 ? `${hp}%` : "☠ DEFEATED"}
            </div>
            {/* Boss bar decorative edge */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: RARITY_COLORS[rarity] }}
            />
        </div>
    );
}

export default function ProjectModal({ project, onClose }: Props) {
    const [showLoot, setShowLoot] = useState(false);

    useEffect(() => {
        if (project) {
            setShowLoot(false);
            const t = setTimeout(() => setShowLoot(true), 1800);
            return () => clearTimeout(t);
        }
    }, [project]);

    if (!project) return null;

    return (
        <AnimatePresence>
            {project && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-[200]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed inset-0 flex items-center justify-center z-[201] p-4"
                    >
                        <div
                            className="pixel-border p-5 md:p-6 max-w-md w-full relative"
                            style={{ background: "#1a1a2e" }}
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-2 right-2 w-8 h-8 pixel-border flex items-center justify-center text-[#aaa] hover:bg-[#ff5555] hover:text-white transition-colors text-xs cursor-pointer"
                                style={{ background: "#333" }}
                            >
                                ✕
                            </button>

                            {/* ── Boss Header ── */}
                            <div className="flex items-center gap-3 mb-3">
                                <motion.div
                                    animate={{
                                        y: [0, -4, 0],
                                        rotate: [0, -5, 5, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="w-14 h-14 pixel-border flex items-center justify-center text-3xl"
                                    style={{ background: "#2a0a0a" }}
                                >
                                    {project.mobIcon}
                                </motion.div>
                                <div className="flex-1">
                                    <p className="text-[8px] text-[#ff5555] uppercase tracking-widest mb-1">
                                        ☠ Boss Encounter
                                    </p>
                                    <h3
                                        className="text-sm drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]"
                                        style={{ color: RARITY_COLORS[project.rarity] }}
                                    >
                                        {project.mob}
                                    </h3>
                                </div>
                            </div>

                            {/* ── Health Bar ── */}
                            <HealthBar rarity={project.rarity} />

                            {/* ── Battle Narrative ── */}
                            <div
                                className="pixel-border-dark p-3 my-4"
                                style={{ background: "#111" }}
                            >
                                <p className="text-[8px] text-[--color-mc-gold] mb-1">
                                    ⚔ Battle Report — {project.name}
                                </p>
                                <p className="text-[9px] text-white/70 leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            {/* ── Weapons Used (Tech Stack) ── */}
                            <div className="mb-4">
                                <p className="text-[8px] text-[#888] mb-2">🗡 Weapons Used:</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="pixel-border px-2 py-1 text-[8px] text-[--color-mc-xp-green]"
                                            style={{ background: "#1a3a1a" }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* ── Loot Dropped ── */}
                            <AnimatePresence>
                                {showLoot && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <p className="text-[8px] text-[--color-mc-gold] mb-2">
                                            ✦ Loot Dropped:
                                        </p>
                                        <div className="grid gap-[3px]">
                                            {project.loot.map((item, i) => (
                                                <motion.div
                                                    key={item}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.15 }}
                                                    className="pixel-border-dark flex items-center gap-2 px-3 py-2"
                                                    style={{ background: "#2a2a0a" }}
                                                >
                                                    <span className="text-[--color-mc-gold] text-xs">
                                                        ◆
                                                    </span>
                                                    <span className="text-[9px] text-[--color-mc-gold]">
                                                        {item}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── Craft button (GitHub) ── */}
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center pixel-border py-3 text-[10px] text-white hover:brightness-125 transition-all mt-4"
                                    style={{ background: "#5d9b37" }}
                                >
                                    ⚒ Collect Loot (View on GitHub)
                                </a>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
