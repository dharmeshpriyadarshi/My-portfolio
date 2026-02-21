"use client";

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

export default function ProjectModal({ project, onClose }: Props) {
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
                        className="fixed inset-0 bg-black/70 z-[200]"
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
                            className="pixel-border p-6 max-w-md w-full relative"
                            style={{ background: "#c6c6c6" }}
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-2 right-2 w-8 h-8 pixel-border flex items-center justify-center text-[#333] hover:bg-[#ff5555] hover:text-white transition-colors text-xs"
                                style={{ background: "#aaa" }}
                            >
                                ✕
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="w-14 h-14 pixel-border-dark flex items-center justify-center text-2xl"
                                    style={{ background: "#8b8b8b" }}
                                >
                                    {project.icon}
                                </div>
                                <div>
                                    <h3
                                        className="text-sm drop-shadow-[1px_1px_0_rgba(0,0,0,0.3)]"
                                        style={{ color: RARITY_COLORS[project.rarity] }}
                                    >
                                        {project.name}
                                    </h3>
                                    <p className="text-[8px] mt-1 capitalize" style={{ color: RARITY_COLORS[project.rarity] }}>
                                        {project.rarity}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="pixel-border-dark p-3 mb-4" style={{ background: "#8b8b8b" }}>
                                <p className="text-[9px] text-[#222] leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            {/* Tech Stack */}
                            <div className="mb-4">
                                <p className="text-[8px] text-[#555] mb-2">Tech Stack:</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="pixel-border px-2 py-1 text-[8px] text-[#222]"
                                            style={{ background: "#aaa" }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Craft button (GitHub) */}
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center pixel-border py-3 text-[10px] text-white hover:brightness-110 transition-all"
                                    style={{ background: "#5d9b37" }}
                                >
                                    ⚒ Craft (View on GitHub)
                                </a>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
