"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HotbarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    sectionId: string;
}

/* ── Pixel-art SVG Icons ── */
const DiamondSword = () => (
    <svg viewBox="0 0 16 16" className="w-7 h-7" style={{ imageRendering: "pixelated" }}>
        <rect x="2" y="12" width="2" height="2" fill="#8B4513" />
        <rect x="4" y="10" width="2" height="2" fill="#8B4513" />
        <rect x="4" y="12" width="2" height="2" fill="#FFD700" />
        <rect x="6" y="8" width="2" height="2" fill="#4FC3F7" />
        <rect x="8" y="6" width="2" height="2" fill="#4FC3F7" />
        <rect x="10" y="4" width="2" height="2" fill="#29B6F6" />
        <rect x="12" y="2" width="2" height="2" fill="#81D4FA" />
    </svg>
);

const Workbench = () => (
    <svg viewBox="0 0 16 16" className="w-7 h-7" style={{ imageRendering: "pixelated" }}>
        <rect x="2" y="2" width="12" height="4" fill="#8D6E3F" />
        <rect x="2" y="2" width="6" height="2" fill="#B8945A" />
        <rect x="8" y="2" width="6" height="2" fill="#6D5430" />
        <rect x="2" y="6" width="12" height="8" fill="#B08050" />
        <rect x="6" y="6" width="4" height="4" fill="#8D6E3F" />
        <rect x="7" y="7" width="2" height="2" fill="#5a3e1e" />
    </svg>
);

const BookQuill = () => (
    <svg viewBox="0 0 16 16" className="w-7 h-7" style={{ imageRendering: "pixelated" }}>
        <rect x="3" y="3" width="8" height="10" fill="#8B4513" />
        <rect x="4" y="4" width="6" height="8" fill="#F5DEB3" />
        <rect x="5" y="5" width="4" height="1" fill="#333" />
        <rect x="5" y="7" width="4" height="1" fill="#333" />
        <rect x="5" y="9" width="3" height="1" fill="#333" />
        <rect x="11" y="2" width="1" height="8" fill="#ccc" />
        <rect x="12" y="1" width="1" height="2" fill="#666" />
    </svg>
);

const MapIcon = () => (
    <svg viewBox="0 0 16 16" className="w-7 h-7" style={{ imageRendering: "pixelated" }}>
        <rect x="2" y="3" width="12" height="10" fill="#D2B48C" />
        <rect x="3" y="4" width="10" height="8" fill="#F5DEB3" />
        <rect x="5" y="5" width="6" height="1" fill="#8B4513" />
        <rect x="4" y="7" width="8" height="1" fill="#8B4513" />
        <rect x="6" y="9" width="4" height="1" fill="#8B4513" />
        <rect x="8" y="6" width="2" height="2" fill="#FF0000" />
    </svg>
);

const GoldenApple = () => (
    <svg viewBox="0 0 16 16" className="w-7 h-7" style={{ imageRendering: "pixelated" }}>
        <rect x="7" y="2" width="2" height="2" fill="#228B22" />
        <rect x="5" y="4" width="6" height="2" fill="#FFD700" />
        <rect x="4" y="6" width="8" height="4" fill="#FFD700" />
        <rect x="5" y="10" width="6" height="2" fill="#FFA500" />
        <rect x="6" y="12" width="4" height="1" fill="#FFA500" />
        <rect x="6" y="6" width="2" height="2" fill="#FFF8DC" opacity="0.6" />
    </svg>
);

const EmptySlot = () => <div className="w-7 h-7" />;

const HOTBAR_ITEMS: HotbarItem[] = [
    { id: "home", label: "Home / About", icon: <DiamondSword />, sectionId: "about" },
    { id: "projects", label: "Projects", icon: <Workbench />, sectionId: "projects" },
    { id: "skills", label: "Technical Skills", icon: <BookQuill />, sectionId: "skills" },
    { id: "experience", label: "Experience", icon: <MapIcon />, sectionId: "experience" },
    { id: "achievements", label: "Achievements", icon: <GoldenApple />, sectionId: "achievements" },
    { id: "e1", label: "", icon: <EmptySlot />, sectionId: "" },
    { id: "e2", label: "", icon: <EmptySlot />, sectionId: "" },
    { id: "e3", label: "", icon: <EmptySlot />, sectionId: "" },
    { id: "e4", label: "", icon: <EmptySlot />, sectionId: "" },
];

export default function Hotbar() {
    const [activeSlot, setActiveSlot] = useState(0);
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

    const handleClick = (idx: number) => {
        setActiveSlot(idx);
        const item = HOTBAR_ITEMS[idx];
        if (item.sectionId) {
            const el = document.getElementById(item.sectionId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    return (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[101]">
            <div
                className="flex gap-[2px] p-[4px] pixel-border"
                style={{ background: "#1a1a1a" }}
            >
                {HOTBAR_ITEMS.map((item, idx) => (
                    <div key={item.id} className="relative">
                        {/* Tooltip */}
                        <AnimatePresence>
                            {hoveredSlot === idx && item.label && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className="mc-tooltip absolute -top-10 left-1/2 -translate-x-1/2 z-50 text-white"
                                >
                                    {item.label}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Slot */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleClick(idx)}
                            onMouseEnter={() => setHoveredSlot(idx)}
                            onMouseLeave={() => setHoveredSlot(null)}
                            className={`
                w-12 h-12 md:w-14 md:h-14 flex items-center justify-center cursor-pointer
                transition-colors duration-100
                ${activeSlot === idx
                                    ? "bg-[#8b8b8b] border-2 border-white/80"
                                    : "bg-[#555] border-2 border-[#333]"
                                }
              `}
                            style={{ imageRendering: "pixelated", perspective: "400px" }}
                        >
                            <motion.div
                                animate={
                                    hoveredSlot === idx
                                        ? { y: [0, -6, 0], rotateY: [0, 360] }
                                        : { y: 0, rotateY: 0 }
                                }
                                transition={
                                    hoveredSlot === idx
                                        ? {
                                            y: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
                                            rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
                                        }
                                        : { duration: 0.3 }
                                }
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {item.icon}
                            </motion.div>
                        </motion.button>

                        {/* Slot number */}
                        <span className="absolute bottom-0 right-0.5 text-[8px] text-white/40 pointer-events-none">
                            {idx + 1}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
