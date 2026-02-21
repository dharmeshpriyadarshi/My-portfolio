"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/context/XPProvider";

/* ═══════════ Data Types ═══════════ */
interface AdvancementNode {
    id: string;
    icon: string;
    title: string;
    description: string;
    /** grid column (0-indexed) */
    col: number;
    /** grid row (0-indexed) */
    row: number;
    /** id of the parent node this connects FROM */
    parentId: string | null;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

const RARITY_COLORS: Record<string, string> = {
    common: "#aaa",
    uncommon: "#55ff55",
    rare: "#5555ff",
    epic: "#aa00aa",
    legendary: "#ffaa00",
};

const RARITY_BG: Record<string, string> = {
    common: "#2a2a3e",
    uncommon: "#1a3a1a",
    rare: "#1a1a4a",
    epic: "#3a1a3a",
    legendary: "#3a2a0a",
};

/* ═══════════ Advancement Tree Data ═══════════ */
const ADVANCEMENTS: AdvancementNode[] = [
    // Row 0 — Root
    {
        id: "root",
        icon: "📦",
        title: "Taking Inventory",
        description: "Started B.Tech at SRM Institute of Science and Technology. The journey begins.",
        col: 3,
        row: 0,
        parentId: null,
        rarity: "common",
    },
    // Row 1 — Early branches
    {
        id: "first-code",
        icon: "⌨️",
        title: "Getting Wood",
        description: "Wrote the first 'Hello World' in C++. A small step that opened infinite possibilities.",
        col: 1,
        row: 1,
        parentId: "root",
        rarity: "uncommon",
    },
    {
        id: "first-web",
        icon: "🌐",
        title: "Crafting a New World",
        description: "Built first website with HTML/CSS. Discovered the joy of pixels coming to life.",
        col: 5,
        row: 1,
        parentId: "root",
        rarity: "uncommon",
    },
    // Row 2 — Deepening
    {
        id: "dsa",
        icon: "🧩",
        title: "Sharpening the Blade",
        description: "Mastered Data Structures & Algorithms. Unlocked the ability to think in trees and graphs.",
        col: 0,
        row: 2,
        parentId: "first-code",
        rarity: "rare",
    },
    {
        id: "java",
        icon: "☕",
        title: "Brewing Potions",
        description: "Learned Java and Object-Oriented Programming. Efficiency IV, Unbreaking III.",
        col: 2,
        row: 2,
        parentId: "first-code",
        rarity: "rare",
    },
    {
        id: "veridian",
        icon: "🌿",
        title: "The Next Generation",
        description: "Completed the Veridian eco-simulation project. Built an AI-driven environmental analysis tool.",
        col: 4,
        row: 2,
        parentId: "first-web",
        rarity: "epic",
    },
    {
        id: "cloud",
        icon: "☁️",
        title: "Above the Clouds",
        description: "Deployed first application to AWS. Infrastructure-as-code with Terraform & Docker.",
        col: 6,
        row: 2,
        parentId: "first-web",
        rarity: "rare",
    },
    // Row 3 — Advanced
    {
        id: "internship",
        icon: "💼",
        title: "Into the Nether",
        description: "Landed first software engineering internship. Real-world C++ and Java in production.",
        col: 1,
        row: 3,
        parentId: "java",
        rarity: "epic",
    },
    {
        id: "fullstack",
        icon: "⚔️",
        title: "Full-Stack Warrior",
        description: "Combined frontend and backend skills into a full-stack arsenal. React + Node + Cloud.",
        col: 5,
        row: 3,
        parentId: "cloud",
        rarity: "epic",
    },
    // Row 4 — Culmination
    {
        id: "graduation",
        icon: "🎓",
        title: "The End?",
        description: "Expected B.Tech graduation — May 2026. Not the end, just the beginning of a new dimension.",
        col: 3,
        row: 4,
        parentId: "internship",
        rarity: "legendary",
    },
];

const COLS = 7;
const ROWS = 5;

/* ═══════════ Helper: compute SVG connection lines ═══════════ */
function getNodeCenter(col: number, row: number, cellW: number, cellH: number) {
    return {
        x: col * cellW + cellW / 2,
        y: row * cellH + cellH / 2,
    };
}

/* ═══════════ Achievement Toast (preserved) ═══════════ */
function AchievementToast({ node }: { node: AdvancementNode }) {
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
                    {node.icon}
                </div>
                <div>
                    <p className="text-[8px] text-[--color-mc-gold]">Advancement Made!</p>
                    <p className="text-[10px] text-white mt-1">{node.title}</p>
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════ Component ═══════════ */
export default function AdvancementTree() {
    const sectionRef = useRef<HTMLElement>(null);
    const treeRef = useRef<HTMLDivElement>(null);
    const { sectionViewed } = useXP();
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [activeToast, setActiveToast] = useState<AdvancementNode | null>(null);
    const shownToasts = useRef<Set<string>>(new Set());
    const [dimensions, setDimensions] = useState({ cellW: 120, cellH: 100 });

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) sectionViewed("achievements");
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [sectionViewed]);

    // Responsive cell sizing
    useEffect(() => {
        const measure = () => {
            if (treeRef.current) {
                const w = treeRef.current.clientWidth;
                setDimensions({
                    cellW: w / COLS,
                    cellH: Math.max(90, Math.min(120, w / COLS * 0.9)),
                });
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const triggerToast = useCallback((node: AdvancementNode) => {
        if (shownToasts.current.has(node.id)) return;
        shownToasts.current.add(node.id);
        setActiveToast(node);
        setTimeout(() => setActiveToast(null), 4000);
    }, []);

    const { cellW, cellH } = dimensions;
    const svgW = COLS * cellW;
    const svgH = ROWS * cellH;

    // Build parent lookup
    const nodeMap = new Map(ADVANCEMENTS.map((n) => [n.id, n]));

    return (
        <>
            {/* Toast overlay */}
            <AnimatePresence>
                {activeToast && <AchievementToast node={activeToast} />}
            </AnimatePresence>

            <section
                id="achievements"
                ref={sectionRef}
                className="py-20 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-8"
            >
                <h2 className="text-xl md:text-2xl text-center text-white drop-shadow-[2px_2px_0_#000] mb-4">
                    🏆 Advancements
                </h2>
                <p className="text-center text-[10px] text-white/50 mb-10">
                    Click a node to learn more
                </p>

                {/* Tree container */}
                <div ref={treeRef} className="relative w-full overflow-x-auto">
                    {/* SVG connection lines */}
                    <svg
                        width={svgW}
                        height={svgH}
                        className="absolute inset-0 pointer-events-none"
                        style={{ zIndex: 0 }}
                    >
                        {ADVANCEMENTS.filter((n) => n.parentId).map((node) => {
                            const parent = nodeMap.get(node.parentId!);
                            if (!parent) return null;
                            const from = getNodeCenter(parent.col, parent.row, cellW, cellH);
                            const to = getNodeCenter(node.col, node.row, cellW, cellH);
                            // Stepped path: vertical from parent, then horizontal, then vertical to child
                            const midY = (from.y + to.y) / 2;
                            const pathD = `M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y}`;
                            return (
                                <motion.path
                                    key={`${parent.id}-${node.id}`}
                                    d={pathD}
                                    fill="none"
                                    stroke="#5d9b37"
                                    strokeWidth={3}
                                    strokeDasharray="8 4"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 0.8, delay: node.row * 0.15 }}
                                    viewport={{ once: true }}
                                    style={{ imageRendering: "pixelated" }}
                                />
                            );
                        })}
                    </svg>

                    {/* Nodes grid */}
                    <div
                        className="relative"
                        style={{ width: svgW, height: svgH }}
                    >
                        {ADVANCEMENTS.map((node) => {
                            const x = node.col * cellW;
                            const y = node.row * cellH;
                            const isSelected = selectedNode === node.id;
                            const nodeSize = Math.min(cellW * 0.65, 72);

                            return (
                                <motion.div
                                    key={node.id}
                                    className="absolute"
                                    style={{
                                        left: x + cellW / 2 - nodeSize / 2,
                                        top: y + cellH / 2 - nodeSize / 2,
                                        width: nodeSize,
                                        height: nodeSize,
                                        zIndex: isSelected ? 20 : 1,
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    onViewportEnter={() => triggerToast(node)}
                                    transition={{
                                        delay: node.row * 0.15 + node.col * 0.05,
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                    viewport={{ once: true, amount: 0.5 }}
                                >
                                    {/* Node button */}
                                    <motion.button
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() =>
                                            setSelectedNode(isSelected ? null : node.id)
                                        }
                                        className="w-full h-full pixel-border flex flex-col items-center justify-center cursor-pointer transition-colors relative"
                                        style={{
                                            background: RARITY_BG[node.rarity],
                                            borderColor: isSelected
                                                ? RARITY_COLORS[node.rarity]
                                                : undefined,
                                        }}
                                    >
                                        <span className="text-xl md:text-2xl">{node.icon}</span>
                                        <span
                                            className="text-[7px] md:text-[8px] mt-1 text-center leading-tight px-1 truncate w-full"
                                            style={{ color: RARITY_COLORS[node.rarity] }}
                                        >
                                            {node.title}
                                        </span>
                                    </motion.button>

                                    {/* Detail popup */}
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                                                className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 z-30 pixel-border p-3"
                                                style={{
                                                    background: RARITY_BG[node.rarity],
                                                    top: "100%",
                                                }}
                                            >
                                                <p
                                                    className="text-[10px] font-bold mb-1"
                                                    style={{ color: RARITY_COLORS[node.rarity] }}
                                                >
                                                    {node.title}
                                                </p>
                                                <p className="text-[8px] text-white/70 leading-relaxed">
                                                    {node.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
